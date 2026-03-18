from __future__ import annotations

import base64
import json
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from analysis_pipeline import load_analysis_config, write_analysis_outputs
from yaml_tools import load_yaml, write_yaml


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
RECORDS = RUNTIME / "records"
EDGE_OUTBOX = RUNTIME / "edge-outbox"
CONFIG_ROOT = RUNTIME / "config"
LOGS = RUNTIME / "logs"

DEFAULT_SETTINGS = {
    "autoSaveEnabled": True,
    "autoSaveInterval": "realtime",
    "autoSyncEnabled": True,
    "autoSyncInterval": "realtime",
}
VALID_INTERVALS = {"realtime", "10s", "1m"}


@dataclass(frozen=True)
class AttachmentPayload:
    name: str
    mime_type: str
    data: bytes


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat()


def ensure_directories() -> None:
    for path in (
        RECORDS,
        EDGE_OUTBOX,
        EDGE_OUTBOX / "entries",
        EDGE_OUTBOX / "deletes",
        EDGE_OUTBOX / "settings",
        EDGE_OUTBOX / "attachments",
        CONFIG_ROOT,
        LOGS,
    ):
        path.mkdir(parents=True, exist_ok=True)


def parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def default_settings(source: str) -> dict[str, Any]:
    return {
        **DEFAULT_SETTINGS,
        "updatedAt": now_iso(),
        "source": source,
    }


def normalize_settings(payload: dict[str, Any], source: str) -> dict[str, Any]:
    return {
        "autoSaveEnabled": bool(payload.get("autoSaveEnabled", True)),
        "autoSaveInterval": payload.get("autoSaveInterval", "realtime")
        if payload.get("autoSaveInterval", "realtime") in VALID_INTERVALS
        else "realtime",
        "autoSyncEnabled": bool(payload.get("autoSyncEnabled", True)),
        "autoSyncInterval": payload.get("autoSyncInterval", "realtime")
        if payload.get("autoSyncInterval", "realtime") in VALID_INTERVALS
        else "realtime",
        "updatedAt": str(payload.get("updatedAt") or now_iso()),
        "source": source,
    }


def settings_file(name: str) -> Path:
    return CONFIG_ROOT / name


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


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


def footer_counts(records: list[dict[str, Any]]) -> dict[str, int]:
    return {
        "records": len(records),
        "photos": sum(
            1
            for record in records
            for item in record.get("attachments", [])
            if str(item.get("mimeType", "")).startswith("image/")
        ),
        "questions": sum(1 for record in records if record.get("question")),
    }


def _candidate_record_files() -> list[Path]:
    return sorted(RECORDS.rglob("*.yaml"))


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
            return {
                "entryId": data.get("entryId", ""),
                "body": data.get("body", ""),
            }
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
        "attachmentId": attachment.get("attachmentId", ""),
        "path": relative,
        "mimeType": attachment.get("mimeType", ""),
        "previewUrl": preview_url,
    }


def list_records() -> list[dict[str, Any]]:
    ensure_directories()
    records: list[dict[str, Any]] = []
    for path in _candidate_record_files():
        entry = _load_record(path)
        if not entry:
            continue
        entry_id = str(entry.get("entryId", path.stem))
        attachments = [
            _normalize_attachment(path, item)
            for item in entry.get("attachments", [])
            if isinstance(item, dict)
        ]
        records.append(
            {
                "entryId": entry_id,
                "headline": entry.get("headline", ""),
                "body": entry.get("body", ""),
                "inputMode": entry.get("inputMode", "text"),
                "projectId": entry.get("projectId", "project-alpha"),
                "capturedAt": entry.get("capturedAt", ""),
                "syncState": (entry.get("sync") or {}).get("state", "local_saved"),
                "attachments": attachments,
                "question": _related_question(path, entry_id),
            }
        )
    records.sort(key=lambda item: str(item.get("capturedAt", "")), reverse=True)
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
            "state": "pc_saved",
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
    for path in _candidate_record_files():
        entry = _load_record(path)
        if not entry:
            continue
        if str(entry.get("entryId", "")) != entry_id:
            continue
        attachments = [
            {
                "attachmentId": item.get("attachmentId", ""),
                "path": item.get("path", ""),
                "mimeType": item.get("mimeType", ""),
            }
            for item in entry.get("attachments", [])
            if isinstance(item, dict)
        ]
        payload = {
            "entryId": entry_id,
            "headline": entry.get("headline", ""),
            "body": entry.get("body", ""),
            "inputMode": entry.get("inputMode", "text"),
            "projectId": entry.get("projectId", "project-alpha"),
            "capturedAt": entry.get("capturedAt", ""),
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


def delete_record(entry_id: str, propagate: bool = True) -> dict[str, Any]:
    ensure_directories()
    removed = 0
    for path in _candidate_record_files():
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
            path.unlink(missing_ok=True)
            removed += 1

    if propagate:
        write_json(
            EDGE_OUTBOX / "deletes" / f"{entry_id}.json",
            {"entryId": entry_id, "deletedAt": now_iso(), "source": "desktop"},
        )
    return {"entryId": entry_id, "removed": removed}


def build_bootstrap_payload() -> dict[str, Any]:
    records = list_records()
    settings = load_shared_settings()
    return {
        "generatedAt": now_iso(),
        "settings": settings,
        "nextSyncText": next_sync_text(settings),
        "records": records,
        "counts": footer_counts(records),
        "latestQuestion": records[0].get("question") if records else None,
    }
