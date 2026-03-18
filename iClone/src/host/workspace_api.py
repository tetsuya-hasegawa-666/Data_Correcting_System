from __future__ import annotations

import base64
import json
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from analysis_pipeline import load_analysis_config, write_analysis_outputs
from yaml_tools import load_yaml, write_yaml


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
RECORDS = RUNTIME / "records"
TRASH = RUNTIME / "trash"
TRASH_RECORDS = TRASH / "records"
EDGE_OUTBOX = RUNTIME / "edge-outbox"
CONFIG_ROOT = RUNTIME / "config"
LOGS = RUNTIME / "logs"
RECONNECT_STATE = CONFIG_ROOT / "reconnect_state.json"

DEFAULT_SETTINGS = {
    "autoSaveEnabled": True,
    "autoSaveInterval": "realtime",
    "autoSyncEnabled": True,
    "autoSyncInterval": "realtime",
}
VALID_INTERVALS = {"realtime", "10s", "1m"}
EXPECTED_CONTAINERS = {"iclone-syncthing", "iclone-observer", "iclone-ollama"}


@dataclass(frozen=True)
class AttachmentPayload:
    name: str
    mime_type: str
    data: bytes


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat()


def parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def ensure_directories() -> None:
    for path in (
        RECORDS,
        TRASH,
        TRASH_RECORDS,
        EDGE_OUTBOX,
        EDGE_OUTBOX / "entries",
        EDGE_OUTBOX / "deletes",
        EDGE_OUTBOX / "settings",
        EDGE_OUTBOX / "attachments",
        CONFIG_ROOT,
        LOGS,
    ):
        path.mkdir(parents=True, exist_ok=True)


def default_settings(source: str) -> dict[str, Any]:
    return {**DEFAULT_SETTINGS, "updatedAt": now_iso(), "source": source}


def normalize_settings(payload: dict[str, Any], source: str) -> dict[str, Any]:
    auto_save_interval = str(payload.get("autoSaveInterval", "realtime"))
    auto_sync_interval = str(payload.get("autoSyncInterval", "realtime"))
    return {
        "autoSaveEnabled": bool(payload.get("autoSaveEnabled", True)),
        "autoSaveInterval": auto_save_interval if auto_save_interval in VALID_INTERVALS else "realtime",
        "autoSyncEnabled": bool(payload.get("autoSyncEnabled", True)),
        "autoSyncInterval": auto_sync_interval if auto_sync_interval in VALID_INTERVALS else "realtime",
        "updatedAt": str(payload.get("updatedAt") or now_iso()),
        "source": source,
    }


def settings_file(name: str) -> Path:
    return CONFIG_ROOT / name


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def load_reconnect_state() -> dict[str, Any]:
    return load_json(RECONNECT_STATE)


def mark_reconnecting(action: str, seconds: int = 20) -> dict[str, Any]:
    payload = {
        "action": action,
        "startedAt": now_iso(),
        "until": (datetime.now(timezone.utc).astimezone() + timedelta(seconds=seconds)).isoformat(),
    }
    write_json(RECONNECT_STATE, payload)
    return payload


def reconnect_active() -> bool:
    state = load_reconnect_state()
    until = state.get("until")
    if not until:
        return False
    try:
        return parse_iso(str(until)) > datetime.now(timezone.utc).astimezone()
    except ValueError:
        return False


def request_host_restart() -> dict[str, Any]:
    mark_reconnecting("server-restart")
    subprocess.Popen(  # noqa: S603
        [
            "powershell",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(ROOT / "scripts" / "start_host_stack.ps1"),
        ],
        cwd=ROOT,
    )
    return {"requested": True, "action": "server-restart"}


def request_device_reconnect() -> dict[str, Any]:
    mark_reconnecting("device-reconnect")
    subprocess.run(["adb", "reconnect"], cwd=ROOT, check=False, capture_output=True, text=True)
    return {"requested": True, "action": "device-reconnect"}


def load_shared_settings() -> dict[str, Any]:
    host = load_json(settings_file("shared_settings.json")) or default_settings("desktop")
    device = load_json(settings_file("device_settings.json"))
    if device:
        host_ts = parse_iso(str(host.get("updatedAt", now_iso())))
        device_ts = parse_iso(str(device.get("updatedAt", now_iso())))
        if device_ts > host_ts:
            return normalize_settings(device, str(device.get("source", "mobile")))
    return normalize_settings(host, str(host.get("source", "desktop")))


def save_host_settings(payload: dict[str, Any]) -> dict[str, Any]:
    ensure_directories()
    settings = normalize_settings(payload, "desktop")
    settings["updatedAt"] = now_iso()
    write_json(settings_file("shared_settings.json"), settings)
    write_json(EDGE_OUTBOX / "settings" / "shared_settings.json", settings)
    return settings


def save_device_settings(payload: dict[str, Any]) -> dict[str, Any]:
    ensure_directories()
    settings = normalize_settings(payload, str(payload.get("source", "mobile")))
    write_json(settings_file("device_settings.json"), settings)
    return settings


def next_sync_text(settings: dict[str, Any]) -> str:
    if not settings.get("autoSyncEnabled", True):
        return "手動"
    interval = str(settings.get("autoSyncInterval", "realtime"))
    if interval == "realtime":
        return "すぐ"
    if interval == "10s":
        return "10秒後"
    return "1分後"


def _candidate_record_files(root: Path = RECORDS) -> list[Path]:
    return sorted(root.rglob("*.yaml"))


def _load_record(path: Path) -> dict[str, Any] | None:
    data = load_yaml(path)
    if not isinstance(data, dict):
        return None
    if str(data.get("entryType")) != "memo":
        return None
    return data


def _related_question(path: Path, entry_id: str) -> dict[str, Any] | None:
    entries_dir = path.parent if path.parent.name == "entries" else path.parent / "entries"
    if not entries_dir.exists():
        return None
    for item in sorted(entries_dir.glob("question-*.yaml")):
        data = load_yaml(item)
        if not isinstance(data, dict):
            continue
        project_context = data.get("projectContext") or {}
        if str(project_context.get("relatedEntryId", "")) == entry_id:
            return {"entryId": str(data.get("entryId", "")), "body": str(data.get("body", ""))}
    return None


def _normalize_attachment(path: Path, attachment: dict[str, Any]) -> dict[str, Any]:
    relative = str(attachment.get("path", ""))
    attachment_path = path.parent / relative
    if not attachment_path.exists():
        attachment_path = path.parent.parent / relative
    preview_url = ""
    if attachment_path.exists():
        preview_url = "/" + str(attachment_path.relative_to(ROOT)).replace("\\", "/")
    return {
        "attachmentId": str(attachment.get("attachmentId", "")),
        "path": relative,
        "mimeType": str(attachment.get("mimeType", "")),
        "previewUrl": preview_url,
    }


def _record_card(path: Path, entry: dict[str, Any], trashed: bool = False) -> dict[str, Any]:
    entry_id = str(entry.get("entryId", path.stem))
    attachments = [
        _normalize_attachment(path, item)
        for item in entry.get("attachments", [])
        if isinstance(item, dict)
    ]
    captured_at = str(entry.get("capturedAt", ""))
    return {
        "entryId": entry_id,
        "headline": str(entry.get("headline", "")),
        "body": str(entry.get("body", "")),
        "inputMode": str(entry.get("inputMode", "text")),
        "projectId": str(entry.get("projectId", "project-alpha")),
        "capturedAt": captured_at,
        "syncState": str((entry.get("sync") or {}).get("state", "local_saved")),
        "attachments": attachments,
        "question": _related_question(path, entry_id),
        "kind": "photo" if any(item["mimeType"].startswith("image/") for item in attachments) else "memo",
        "trashed": trashed,
        "trashedAt": datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).astimezone().isoformat() if trashed else "",
    }


def list_records() -> list[dict[str, Any]]:
    ensure_directories()
    records: list[dict[str, Any]] = []
    for path in _candidate_record_files(RECORDS):
        entry = _load_record(path)
        if entry:
            records.append(_record_card(path, entry, trashed=False))
    records.sort(key=lambda item: str(item.get("capturedAt", "")), reverse=True)
    return records


def list_trash_records() -> list[dict[str, Any]]:
    ensure_directories()
    records: list[dict[str, Any]] = []
    for path in _candidate_record_files(TRASH_RECORDS):
        entry = _load_record(path)
        if entry:
            records.append(_record_card(path, entry, trashed=True))
    records.sort(key=lambda item: str(item.get("trashedAt", "")), reverse=True)
    return records


def _attachment_from_payload(payload: dict[str, Any]) -> AttachmentPayload | None:
    attachment = payload.get("attachment")
    if not isinstance(attachment, dict):
        return None
    data_url = str(attachment.get("dataUrl", ""))
    if "," not in data_url:
        return None
    mime_type = str(attachment.get("mimeType", "image/jpeg")) or "image/jpeg"
    data = base64.b64decode(data_url.split(",", 1)[1])
    return AttachmentPayload(
        name=str(attachment.get("name", "attachment.jpg")),
        mime_type=mime_type,
        data=data,
    )


def _file_extension(mime_type: str) -> str:
    if mime_type.endswith("png"):
        return "png"
    if mime_type.endswith("webp"):
        return "webp"
    return "jpg"


def _session_root(project_id: str, captured_at: datetime, session_id: str) -> Path:
    return RECORDS / project_id / f"{captured_at.year:04d}" / f"{captured_at.month:02d}" / session_id


def _queue_host_entry_for_device(entry: dict[str, Any], attachment_source: Path | None) -> None:
    write_json(EDGE_OUTBOX / "entries" / f"{entry['entryId']}.json", entry)
    if attachment_source and attachment_source.exists():
        target = EDGE_OUTBOX / "attachments" / attachment_source.name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(attachment_source.read_bytes())


def create_host_entry(payload: dict[str, Any], sync_now: bool = True) -> dict[str, Any]:
    ensure_directories()
    analysis_config = load_analysis_config()
    captured_at = datetime.now(timezone.utc).astimezone()
    entry_id = str(payload.get("entryId") or f"entry-desktop-{captured_at.strftime('%Y%m%d-%H%M%S')}")
    project_id = str(payload.get("projectId") or "project-alpha")
    session_id = str(payload.get("sessionId") or f"session-desktop-{captured_at.strftime('%Y%m%d-%H%M%S')}")
    body = str(payload.get("body", "")).strip()
    headline = str(payload.get("headline", "")).strip() or (body[:24] if body else "PCメモ")
    attachment = _attachment_from_payload(payload)
    input_mode = "photo" if attachment else "text"

    session_root = _session_root(project_id, captured_at, session_id)
    session_root.mkdir(parents=True, exist_ok=True)
    attachments_yaml: list[dict[str, Any]] = []
    attachment_source: Path | None = None
    if attachment:
        attachments_dir = session_root / "attachments"
        attachments_dir.mkdir(parents=True, exist_ok=True)
        attachment_name = f"photo-{entry_id}.{_file_extension(attachment.mime_type)}"
        attachment_source = attachments_dir / attachment_name
        attachment_source.write_bytes(attachment.data)
        attachments_yaml.append(
            {
                "attachmentId": f"photo-{entry_id}",
                "path": f"attachments/{attachment_name}",
                "mimeType": attachment.mime_type,
            }
        )

    raw_record = {
        "schemaVersion": "1.0.0",
        "entryId": entry_id,
        "entryType": "memo",
        "projectId": project_id,
        "sessionId": session_id,
        "capturedAt": captured_at.isoformat(),
        "deviceId": "windows-host-primary",
        "inputMode": input_mode,
        "body": body,
        "attachments": attachments_yaml,
        "projectContext": {
            "customer": "desktop-user",
            "phase": "validation",
            "topic": "workspace_clone",
        },
        "sync": {
            "peerId": "HOST-DESKTOP",
            "state": "pc_saved" if sync_now else "local_saved",
        },
        "headline": headline,
    }

    raw_path = session_root / f"{entry_id}.yaml"
    write_yaml(raw_path, raw_record)
    outputs = write_analysis_outputs(analysis_config, raw_path)
    memo_path = outputs["memo"]
    saved = load_yaml(memo_path)
    if not isinstance(saved, dict):
        saved = raw_record

    clone_payload = {
        "entryId": entry_id,
        "headline": headline,
        "body": body,
        "inputMode": input_mode,
        "projectId": project_id,
        "capturedAt": captured_at.isoformat(),
        "attachments": attachments_yaml,
    }
    if sync_now:
        _queue_host_entry_for_device(clone_payload, attachment_source)

    return {
        "entryId": entry_id,
        "headline": headline,
        "body": body,
        "inputMode": input_mode,
        "capturedAt": captured_at.isoformat(),
        "question": "",
        "savedPath": str(memo_path),
        "syncQueued": sync_now,
        "record": saved,
    }


def queue_record_for_device(entry_id: str) -> dict[str, Any]:
    ensure_directories()
    for path in _candidate_record_files(RECORDS):
        entry = _load_record(path)
        if not entry or str(entry.get("entryId", "")) != entry_id:
            continue
        attachments = [
            {
                "attachmentId": str(item.get("attachmentId", "")),
                "path": str(item.get("path", "")),
                "mimeType": str(item.get("mimeType", "")),
            }
            for item in entry.get("attachments", [])
            if isinstance(item, dict)
        ]
        payload = {
            "entryId": entry_id,
            "headline": str(entry.get("headline", "")),
            "body": str(entry.get("body", "")),
            "inputMode": str(entry.get("inputMode", "text")),
            "projectId": str(entry.get("projectId", "project-alpha")),
            "capturedAt": str(entry.get("capturedAt", "")),
            "attachments": attachments,
        }
        attachment_source = None
        if attachments:
            maybe_path = path.parent / str(attachments[0]["path"])
            if not maybe_path.exists():
                maybe_path = path.parent.parent / str(attachments[0]["path"])
            if maybe_path.exists():
                attachment_source = maybe_path
        _queue_host_entry_for_device(payload, attachment_source)
        return {"entryId": entry_id, "queued": True}
    return {"entryId": entry_id, "queued": False}


def _matching_record_files(root: Path, entry_id: str) -> list[Path]:
    matched: list[Path] = []
    for path in _candidate_record_files(root):
        data = load_yaml(path)
        if not isinstance(data, dict):
            continue
        current_entry_id = str(data.get("entryId", ""))
        project_context = data.get("projectContext") or {}
        evidence = [str(value) for value in data.get("evidenceEntryIds", [])]
        source_entry_id = str(data.get("sourceEntryId", ""))
        related_entry_id = str(project_context.get("relatedEntryId", ""))
        if (
            current_entry_id == entry_id
            or source_entry_id == entry_id
            or related_entry_id == entry_id
            or entry_id in evidence
        ):
            matched.append(path)
    return matched


def move_record_to_trash(entry_id: str) -> dict[str, Any]:
    ensure_directories()
    moved = 0
    for path in _matching_record_files(RECORDS, entry_id):
        target = TRASH_RECORDS / path.relative_to(RECORDS)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(path), str(target))
        moved += 1
    return {"entryId": entry_id, "moved": moved}


def delete_record(entry_id: str, propagate: bool = True) -> dict[str, Any]:
    ensure_directories()
    removed = 0
    for path in _matching_record_files(TRASH_RECORDS, entry_id):
        path.unlink(missing_ok=True)
        removed += 1
    if propagate:
        write_json(
            EDGE_OUTBOX / "deletes" / f"{entry_id}.json",
            {"entryId": entry_id, "deletedAt": now_iso(), "source": "desktop"},
        )
    return {"entryId": entry_id, "removed": removed}


def empty_trash(propagate: bool = True) -> dict[str, Any]:
    ensure_directories()
    deleted_ids: list[str] = []
    for path in _candidate_record_files(TRASH_RECORDS):
        data = load_yaml(path)
        if not isinstance(data, dict):
            continue
        entry_id = str(data.get("entryId", ""))
        if entry_id and entry_id not in deleted_ids:
            deleted_ids.append(entry_id)
        path.unlink(missing_ok=True)
    if propagate:
        for entry_id in deleted_ids:
            write_json(
                EDGE_OUTBOX / "deletes" / f"{entry_id}.json",
                {"entryId": entry_id, "deletedAt": now_iso(), "source": "desktop"},
            )
    return {"removed": len(deleted_ids)}


def _load_bridge_runtime_state() -> dict[str, Any]:
    path = LOGS / "adb_bridge_state.json"
    return load_json(path) if path.exists() else {}


def _parse_optional_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return parse_iso(value)
    except ValueError:
        return None


def docker_status() -> dict[str, Any]:
    try:
        result = subprocess.run(
            ["docker", "ps", "--format", "{{.Names}}"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
        )
    except OSError:
        return {"available": False, "running": [], "ready": False}

    if result.returncode != 0:
        return {"available": False, "running": [], "ready": False}

    running = {line.strip() for line in result.stdout.splitlines() if line.strip()}
    return {
        "available": True,
        "running": sorted(running),
        "ready": EXPECTED_CONTAINERS.issubset(running),
    }


def queue_depths() -> dict[str, int]:
    def count_files(path: Path, pattern: str) -> int:
        return sum(1 for _ in path.rglob(pattern)) if path.exists() else 0

    return {
        "entries": count_files(EDGE_OUTBOX / "entries", "*.json"),
        "deletes": count_files(EDGE_OUTBOX / "deletes", "*.json"),
        "settings": count_files(EDGE_OUTBOX / "settings", "*.json"),
        "attachments": count_files(EDGE_OUTBOX / "attachments", "*.*"),
    }


def _fresh_within(timestamp: datetime | None, seconds: int) -> bool:
    return False if timestamp is None else datetime.now(timezone.utc).astimezone() - timestamp <= timedelta(seconds=seconds)


def build_sync_badge(records: list[dict[str, Any]], settings: dict[str, Any]) -> dict[str, Any]:
    bridge = _load_bridge_runtime_state()
    bridge_at = _parse_optional_iso(str(bridge.get("generatedAt", "")))
    bridge_fresh = _fresh_within(bridge_at, 15)
    docker = docker_status()
    reconnecting = reconnect_active()
    server_checked = bool(docker.get("ready"))
    queue_total = sum(queue_depths().values())
    activity_total = sum(
        int(bridge.get(key, 0) or 0)
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
    any_active = bool(records)

    if reconnecting:
        connector = {"text": "- - - -", "level": "warn", "label": "再接続中", "blink": True}
        mobile_level = "warn"
        server_level = "warn"
        server_checked_value = True
    elif server_checked and (activity_total > 0 or any_active and settings.get("autoSyncEnabled", True) and settings.get("autoSyncInterval") == "realtime"):
        connector = {"text": "<--->", "level": "good", "label": "同期中"}
        mobile_level = "good"
        server_level = "good"
        server_checked_value = True
    elif server_checked and (bridge_fresh or queue_total >= 0):
        connector = {"text": "- - - -", "level": "warn", "label": "同期環境構築中"}
        mobile_level = "good"
        server_level = "warn"
        server_checked_value = True
    else:
        connector = {"text": "--×--", "level": "bad", "label": "圏外 / server停止"}
        mobile_level = "good"
        server_level = "bad"
        server_checked_value = False

    return {
        "mobile": {"label": "Mobile", "checked": True, "level": mobile_level},
        "server": {"label": "Server", "checked": server_checked_value, "level": server_level},
        "connector": connector,
        "nextSyncText": next_sync_text(settings),
        "docker": docker,
        "bridgeFresh": bridge_fresh,
        "reconnecting": reconnecting,
    }


def build_bootstrap_payload() -> dict[str, Any]:
    records = list_records()
    trash_records = list_trash_records()
    memo_records = [record for record in records if record.get("kind") == "memo"]
    photo_records = [record for record in records if record.get("kind") == "photo"]
    settings = load_shared_settings()
    sync = build_sync_badge(records, settings)
    return {
        "generatedAt": now_iso(),
        "settings": settings,
        "nextSyncText": sync["nextSyncText"],
        "sync": sync,
        "records": records,
        "memoRecords": memo_records,
        "photoRecords": photo_records,
        "trashRecords": trash_records,
        "counts": {
            "records": len(records),
            "photos": len(photo_records),
            "questions": sum(1 for record in records if record.get("question")),
            "trash": len(trash_records),
        },
        "latestQuestion": records[0].get("question") if records else None,
    }
