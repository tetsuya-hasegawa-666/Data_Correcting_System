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

from workspace_api import delete_record, ensure_directories as ensure_workspace_dirs, save_device_settings
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
    device_label = os.environ.get("ICLONE_DEVICE_LABEL", "xperia5iii-edge-001")
    return BridgeConfig(
        serial=serial,
        package_name=package_name,
        device_label=device_label,
        remote_root=remote_root,
        host_inbox=Path(os.environ.get("ICLONE_HOST_INBOX", "runtime/host-inbox")) / device_label,
        edge_outbox=Path(os.environ.get("ICLONE_EDGE_OUTBOX", "runtime/edge-outbox")),
        device_cache=cache_root / serial,
        logs_root=logs_root,
        poll_seconds=int(os.environ.get("ICLONE_POLL_SECONDS", "1")),
    )


def ensure_directories(config: BridgeConfig) -> None:
    ensure_workspace_dirs()
    for path in (config.host_inbox, config.edge_outbox, config.device_cache, config.logs_root):
        path.mkdir(parents=True, exist_ok=True)
    for subdir in ("attachments", "deletes", "settings"):
        (config.host_inbox / subdir).mkdir(parents=True, exist_ok=True)


def adb_command(config: BridgeConfig, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["adb", "-s", config.serial, *args],
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
    return f"{config.serial}\tdevice" in result.stdout


def stable_hash(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def load_bridge_state(config: BridgeConfig) -> dict:
    target = config.device_cache / ".bridge_state.json"
    if not target.exists():
        return {"entries": {}, "questions": {}, "hostEntries": {}, "settings": {}, "deletes": {}}
    return json.loads(target.read_text(encoding="utf-8"))


def save_bridge_state(config: BridgeConfig, state: dict) -> None:
    target = config.device_cache / ".bridge_state.json"
    target.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def pull_sync_outbox(config: BridgeConfig) -> Path:
    local_root = config.device_cache / "sync-outbox"
    if local_root.exists():
        shutil.rmtree(local_root)
    local_root.parent.mkdir(parents=True, exist_ok=True)
    result = adb_command(config, "pull", f"{config.remote_root}/sync-outbox", str(local_root))
    append_log(config, f"pull sync-outbox rc={result.returncode}")
    return local_root


def push_json(config: BridgeConfig, payload: dict, remote_path: str) -> None:
    tmp_root = config.device_cache / ".push-tmp"
    tmp_root.mkdir(parents=True, exist_ok=True)
    local_file = tmp_root / Path(remote_path).name
    local_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    adb_command(config, "shell", "mkdir", "-p", str(Path(remote_path).parent).replace("\\", "/"))
    adb_command(config, "push", str(local_file), remote_path)


def push_file(config: BridgeConfig, source_path: Path, remote_path: str) -> None:
    adb_command(config, "shell", "mkdir", "-p", str(Path(remote_path).parent).replace("\\", "/"))
    adb_command(config, "push", str(source_path), remote_path)


def docker_status() -> dict:
    result = subprocess.run(
        ["docker", "ps", "--format", "{{.Names}}"],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )
    if result.returncode != 0:
        return {"available": False, "ready": False, "running": []}
    running = {line.strip() for line in result.stdout.splitlines() if line.strip()}
    required = {"iclone-syncthing", "iclone-observer", "iclone-ollama"}
    return {
        "available": True,
        "ready": required.issubset(running),
        "running": sorted(running),
    }


def mirror_entries(config: BridgeConfig, state: dict, sync_root: Path) -> int:
    if not sync_root.exists():
        return 0
    mirrored = 0
    tracked_entries: dict[str, str] = state.setdefault("entries", {})
    attachments_root = sync_root / "attachments"

    for source_path in sorted(sync_root.glob("*.yaml")):
        digest = stable_hash(source_path)
        tracked_key = source_path.name
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
        push_json(
            config,
            {
                "entryId": entry.get("entryId", source_path.stem),
                "state": "pc_received",
                "mirroredAt": datetime.now(timezone.utc).astimezone().isoformat(),
            },
            f"{config.remote_root}/sync-inbox/acks/ack-{entry.get('entryId', source_path.stem)}.json",
        )
    return mirrored


def mirror_deletes(config: BridgeConfig, state: dict, sync_root: Path) -> int:
    deletes_root = sync_root / "deletes"
    if not deletes_root.exists():
        return 0
    tracked: dict[str, str] = state.setdefault("deletes", {})
    processed = 0
    for source_path in sorted(deletes_root.glob("*.json")):
        digest = stable_hash(source_path)
        key = source_path.name
        if tracked.get(key) == digest:
            continue
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        entry_id = str(payload.get("entryId", ""))
        if entry_id:
            delete_record(entry_id, propagate=False)
            tracked[key] = digest
            processed += 1
            append_log(config, f"applied device delete {entry_id}")
    return processed


def mirror_settings(config: BridgeConfig, state: dict, sync_root: Path) -> int:
    settings_root = sync_root / "settings"
    if not settings_root.exists():
        return 0
    tracked: dict[str, str] = state.setdefault("settings", {})
    processed = 0
    for source_path in sorted(settings_root.glob("*.json")):
        digest = stable_hash(source_path)
        key = source_path.name
        if tracked.get(key) == digest:
            continue
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        save_device_settings(payload)
        tracked[key] = digest
        processed += 1
        append_log(config, f"mirrored device settings {source_path.name}")
    return processed


def push_questions(config: BridgeConfig, state: dict) -> int:
    tracked_questions: dict[str, str] = state.setdefault("questions", {})
    pushed = 0
    for source_path in sorted(config.edge_outbox.rglob("question-*.yaml")):
        digest = stable_hash(source_path)
        key = str(source_path.relative_to(config.edge_outbox))
        if tracked_questions.get(key) == digest:
            continue
        question = load_yaml(source_path)
        if not isinstance(question, dict):
            continue
        push_json(
            config,
            {
                "entryId": question.get("entryId", source_path.stem),
                "headline": question.get("headline", "Next question"),
                "body": question.get("body", ""),
                "capturedAt": question.get("capturedAt", ""),
                "projectId": question.get("projectId", ""),
                "sessionId": question.get("sessionId", ""),
            },
            f"{config.remote_root}/sync-inbox/questions/{question.get('entryId', source_path.stem)}.json",
        )
        tracked_questions[key] = digest
        pushed += 1
    return pushed


def push_host_entries(config: BridgeConfig, state: dict) -> int:
    tracked: dict[str, str] = state.setdefault("hostEntries", {})
    pushed = 0
    entries_root = config.edge_outbox / "entries"
    for source_path in sorted(entries_root.glob("*.json")):
        digest = stable_hash(source_path)
        key = source_path.name
        if tracked.get(key) == digest:
            continue
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        remote_path = f"{config.remote_root}/sync-inbox/entries/{source_path.name}"
        push_json(config, payload, remote_path)
        for attachment in payload.get("attachments", []):
            if not isinstance(attachment, dict):
                continue
            relative_path = str(attachment.get("path", ""))
            attachment_source = config.edge_outbox / "attachments" / Path(relative_path).name
            if attachment_source.exists():
                push_file(
                    config,
                    attachment_source,
                    f"{config.remote_root}/sync-inbox/{relative_path}",
                )
        tracked[key] = digest
        pushed += 1
    return pushed


def push_host_deletes(config: BridgeConfig, state: dict) -> int:
    tracked: dict[str, str] = state.setdefault("hostDeletes", {})
    pushed = 0
    deletes_root = config.edge_outbox / "deletes"
    for source_path in sorted(deletes_root.glob("*.json")):
        digest = stable_hash(source_path)
        key = source_path.name
        if tracked.get(key) == digest:
            continue
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        push_json(config, payload, f"{config.remote_root}/sync-inbox/deletes/{source_path.name}")
        tracked[key] = digest
        pushed += 1
    return pushed


def push_host_settings(config: BridgeConfig, state: dict) -> int:
    tracked: dict[str, str] = state.setdefault("hostSettings", {})
    pushed = 0
    settings_root = config.edge_outbox / "settings"
    for source_path in sorted(settings_root.glob("*.json")):
        digest = stable_hash(source_path)
        key = source_path.name
        if tracked.get(key) == digest:
            continue
        payload = json.loads(source_path.read_text(encoding="utf-8"))
        push_json(config, payload, f"{config.remote_root}/sync-inbox/settings/{source_path.name}")
        tracked[key] = digest
        pushed += 1
    return pushed


def scan_once(config: BridgeConfig, state: dict) -> None:
    connected = is_connected(config)
    docker = docker_status()
    payload = {
        "serial": config.serial,
        "connected": connected,
        "serverReady": docker["ready"],
        "dockerAvailable": docker["available"],
        "dockerRunning": docker["running"],
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "hostInbox": str(config.host_inbox),
        "remoteRoot": config.remote_root,
    }
    if not connected:
        write_state_file(config, payload)
        append_log(config, "device not connected")
        return

    sync_root = pull_sync_outbox(config)
    payload["mirroredEntries"] = mirror_entries(config, state, sync_root)
    payload["appliedDeletes"] = mirror_deletes(config, state, sync_root)
    payload["mirroredSettings"] = mirror_settings(config, state, sync_root)
    payload["pushedQuestions"] = push_questions(config, state)
    payload["pushedEntries"] = push_host_entries(config, state)
    payload["pushedDeletes"] = push_host_deletes(config, state)
    payload["pushedSettings"] = push_host_settings(config, state)
    total_activity = sum(
        int(payload.get(key, 0) or 0)
        for key in (
            "mirroredEntries",
            "appliedDeletes",
            "mirroredSettings",
            "pushedQuestions",
            "pushedEntries",
            "pushedDeletes",
            "pushedSettings",
        )
    )
    if not docker["ready"]:
        connector = {"text": "--×--", "level": "bad", "label": "圏外 / server停止"}
        mobile_level = "good"
        server_level = "bad"
    elif total_activity > 0:
        connector = {"text": "<--->", "level": "good", "label": "同期中"}
        mobile_level = "good"
        server_level = "good"
    else:
        connector = {"text": "- - - -", "level": "warn", "label": "同期環境構築中"}
        mobile_level = "good"
        server_level = "warn"
    payload["connector"] = connector
    push_json(
        config,
        {
            "generatedAt": payload["generatedAt"],
            "mobileChecked": True,
            "serverChecked": docker["ready"],
            "mobileLevel": mobile_level,
            "serverLevel": server_level,
            "connector": connector,
            "nextSyncText": "すぐ",
        },
        f"{config.remote_root}/sync-inbox/status/bridge_status.json",
    )
    write_state_file(config, payload)
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
