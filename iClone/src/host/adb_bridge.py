from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from yaml_tools import load_yaml


@dataclass(frozen=True)
class BridgeConfig:
    serial: str
    package_name: str
    device_label: str
    remote_root: str
    host_inbox: Path
    edge_outbox: Path
    device_cache: Path
    logs_root: Path
    poll_seconds: int


def load_config() -> BridgeConfig:
    package_name = os.environ.get("ICLONE_ANDROID_PACKAGE", "com.iclone.mobile")
    serial = os.environ.get("ICLONE_ANDROID_SERIAL", "QV788MFJA6")
    cache_root = Path(os.environ.get("ICLONE_DEVICE_CACHE_ROOT", "runtime/device-cache"))
    logs_root = Path(os.environ.get("ICLONE_LOGS_ROOT", "runtime/logs"))
    remote_root = os.environ.get(
        "ICLONE_ANDROID_REMOTE_ROOT",
        f"/sdcard/Android/data/{package_name}/files/iclone",
    )
    return BridgeConfig(
        serial=serial,
        package_name=package_name,
        device_label=os.environ.get("ICLONE_DEVICE_LABEL", "xperia5iii-edge-001"),
        remote_root=remote_root,
        host_inbox=Path(os.environ.get("ICLONE_HOST_INBOX", "runtime/host-inbox")) / os.environ.get("ICLONE_DEVICE_LABEL", "xperia5iii-edge-001"),
        edge_outbox=Path(os.environ.get("ICLONE_EDGE_OUTBOX", "runtime/edge-outbox")),
        device_cache=cache_root / serial,
        logs_root=logs_root,
        poll_seconds=int(os.environ.get("ICLONE_POLL_SECONDS", "4")),
    )


def ensure_directories(config: BridgeConfig) -> None:
    for path in (config.host_inbox, config.edge_outbox, config.device_cache, config.logs_root):
        path.mkdir(parents=True, exist_ok=True)
    (config.host_inbox / "attachments").mkdir(parents=True, exist_ok=True)


def adb_command(config: BridgeConfig, *args: str) -> subprocess.CompletedProcess[str]:
    command = ["adb", "-s", config.serial, *args]
    return subprocess.run(
        command,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )


def append_log(config: BridgeConfig, message: str) -> None:
    target = config.logs_root / "adb_bridge.log"
    target.parent.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).isoformat()
    with target.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")


def write_state_file(config: BridgeConfig, payload: dict) -> None:
    target = config.logs_root / "adb_bridge_state.json"
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def is_connected(config: BridgeConfig) -> bool:
    result = subprocess.run(
        ["adb", "devices"],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )
    marker = f"{config.serial}\tdevice"
    return marker in result.stdout


def stable_hash(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def load_bridge_state(config: BridgeConfig) -> dict:
    target = config.device_cache / ".bridge_state.json"
    if not target.exists():
        return {"entries": {}, "questions": {}}
    return json.loads(target.read_text(encoding="utf-8"))


def save_bridge_state(config: BridgeConfig, state: dict) -> None:
    target = config.device_cache / ".bridge_state.json"
    target.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def pull_sync_outbox(config: BridgeConfig) -> None:
    local_root = config.device_cache / "sync-outbox"
    if local_root.exists():
        shutil.rmtree(local_root)
    local_root.parent.mkdir(parents=True, exist_ok=True)
    result = adb_command(config, "pull", f"{config.remote_root}/sync-outbox", str(local_root))
    append_log(config, f"pull sync-outbox rc={result.returncode}")


def push_json(config: BridgeConfig, payload: dict, remote_path: str) -> None:
    tmp_root = config.device_cache / ".push-tmp"
    tmp_root.mkdir(parents=True, exist_ok=True)
    local_file = tmp_root / Path(remote_path).name
    local_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    adb_command(config, "shell", "mkdir", "-p", str(Path(remote_path).parent).replace("\\", "/"))
    adb_command(config, "push", str(local_file), remote_path)


def mirror_entries(config: BridgeConfig, state: dict) -> int:
    sync_root = config.device_cache / "sync-outbox"
    if not sync_root.exists():
        return 0

    mirrored = 0
    tracked_entries: dict[str, str] = state.setdefault("entries", {})
    attachments_root = sync_root / "attachments"

    for source_path in sorted(sync_root.glob("*.yaml")):
        digest = stable_hash(source_path)
        tracked_key = str(source_path.name)
        if tracked_entries.get(tracked_key) == digest:
            continue

        entry = load_yaml(source_path)
        if not isinstance(entry, dict):
            continue

        shutil.copy2(source_path, config.host_inbox / source_path.name)
        for attachment in entry.get("attachments") or []:
            if not isinstance(attachment, dict):
                continue
            relative_path = str(attachment.get("path", "")).strip()
            if not relative_path:
                continue
            attachment_source = attachments_root / Path(relative_path).name
            attachment_target = config.host_inbox / "attachments" / attachment_source.name
            if attachment_source.exists():
                shutil.copy2(attachment_source, attachment_target)

        tracked_entries[tracked_key] = digest
        mirrored += 1

        ack_payload = {
            "entryId": entry.get("entryId", source_path.stem),
            "state": "pc_received",
            "hostInboxPath": str((config.host_inbox / source_path.name).as_posix()),
            "mirroredAt": datetime.now(timezone.utc).astimezone().isoformat(),
        }
        remote_ack = f"{config.remote_root}/sync-inbox/acks/ack-{entry.get('entryId', source_path.stem)}.json"
        push_json(config, ack_payload, remote_ack)
        append_log(config, f"mirrored {source_path.name}")

    return mirrored


def push_questions(config: BridgeConfig, state: dict) -> int:
    pushed = 0
    tracked_questions: dict[str, str] = state.setdefault("questions", {})
    for source_path in sorted(config.edge_outbox.rglob("*.yaml")):
        digest = stable_hash(source_path)
        tracked_key = str(source_path.relative_to(config.edge_outbox))
        if tracked_questions.get(tracked_key) == digest:
            continue

        question = load_yaml(source_path)
        if not isinstance(question, dict):
            continue

        payload = {
            "entryId": question.get("entryId", source_path.stem),
            "headline": question.get("headline", "次の質問"),
            "body": question.get("body", ""),
            "capturedAt": question.get("capturedAt", ""),
            "projectId": question.get("projectId", ""),
            "sessionId": question.get("sessionId", ""),
        }
        remote_path = f"{config.remote_root}/sync-inbox/questions/{payload['entryId']}.json"
        push_json(config, payload, remote_path)
        tracked_questions[tracked_key] = digest
        pushed += 1
        append_log(config, f"pushed question {source_path.name}")

    return pushed


def scan_once(config: BridgeConfig, state: dict) -> None:
    connected = is_connected(config)
    status_payload = {
        "serial": config.serial,
        "connected": connected,
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "hostInbox": str(config.host_inbox),
        "remoteRoot": config.remote_root,
    }
    if not connected:
        write_state_file(config, status_payload)
        append_log(config, "device not connected")
        return

    pull_sync_outbox(config)
    mirrored = mirror_entries(config, state)
    pushed = push_questions(config, state)
    status_payload["mirroredEntries"] = mirrored
    status_payload["pushedQuestions"] = pushed
    write_state_file(config, status_payload)
    save_bridge_state(config, state)


def main() -> None:
    config = load_config()
    ensure_directories(config)
    state = load_bridge_state(config)
    append_log(config, "adb bridge started")
    while True:
        try:
            scan_once(config, state)
        except Exception as error:  # noqa: BLE001
            append_log(config, f"bridge failed reason={error}")
        time.sleep(config.poll_seconds)


if __name__ == "__main__":
    main()
