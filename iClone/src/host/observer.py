from __future__ import annotations

import json
import os
import shutil
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from analysis_pipeline import (
    append_log as append_analysis_log,
    load_analysis_config,
    route_to_dead_letter,
    validate_entry,
    write_analysis_outputs,
)
from yaml_tools import load_yaml, write_yaml


@dataclass(frozen=True)
class ObserverConfig:
    host_inbox: Path
    records_root: Path
    llm_inbox: Path
    logs_root: Path
    dead_letter_root: Path
    poll_seconds: int


def load_config() -> ObserverConfig:
    return ObserverConfig(
        host_inbox=Path(os.environ.get("ICLONE_HOST_INBOX", "runtime/host-inbox")),
        records_root=Path(os.environ.get("ICLONE_RECORDS_ROOT", "runtime/records")),
        llm_inbox=Path(os.environ.get("ICLONE_LLM_INBOX", "runtime/llm_inbox")),
        logs_root=Path(os.environ.get("ICLONE_LOGS_ROOT", "runtime/logs")),
        dead_letter_root=Path(os.environ.get("ICLONE_DEAD_LETTER_ROOT", "runtime/dead-letter")),
        poll_seconds=int(os.environ.get("ICLONE_POLL_SECONDS", "3")),
    )


def ensure_directories(config: ObserverConfig) -> None:
    for path in (
        config.host_inbox,
        config.records_root,
        config.llm_inbox,
        config.logs_root,
        config.dead_letter_root,
    ):
        path.mkdir(parents=True, exist_ok=True)


def iter_yaml_files(root: Path) -> Iterable[Path]:
    if not root.exists():
        return []
    return root.rglob("*.yaml")


def append_log(config: ObserverConfig, message: str) -> None:
    stamp = datetime.now(timezone.utc).isoformat()
    log_file = config.logs_root / "observer.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with log_file.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")


def target_record_path(config: ObserverConfig, source_path: Path, entry: dict) -> Path:
    project_id = str(entry.get("projectId", "unknown-project"))
    captured_at = str(entry.get("capturedAt", "1970-01-01T00:00:00+00:00"))
    dt = datetime.fromisoformat(captured_at.replace("Z", "+00:00"))
    session_id = str(entry.get("sessionId", "session-unknown"))
    relative = Path(project_id) / f"{dt.year:04d}" / f"{dt.month:02d}" / session_id / source_path.name
    return config.records_root / relative


def copy_attachments(source_path: Path, target_path: Path, entry: dict) -> dict:
    attachments = entry.get("attachments")
    if not isinstance(attachments, list):
        return entry

    copied: list[dict] = []
    session_root = target_path.parent
    attachments_root = session_root / "attachments"
    attachments_root.mkdir(parents=True, exist_ok=True)

    for item in attachments:
        if not isinstance(item, dict):
            continue
        relative_path = str(item.get("path", "")).strip()
        if not relative_path:
            copied.append(item)
            continue

        source_attachment = source_path.parent / relative_path
        if not source_attachment.exists():
            alt_source = source_path.parent.parent / relative_path
            source_attachment = alt_source if alt_source.exists() else source_attachment

        target_attachment = attachments_root / Path(relative_path).name
        if source_attachment.exists():
            shutil.copy2(source_attachment, target_attachment)

        copied_item = dict(item)
        copied_item["path"] = str(Path("attachments") / target_attachment.name)
        copied.append(copied_item)

    normalized = dict(entry)
    normalized["attachments"] = copied
    return normalized


def mirrored_llm_path(config: ObserverConfig, target_path: Path) -> Path:
    relative = target_path.relative_to(config.records_root)
    return config.llm_inbox / relative


def write_sidecar(target_path: Path, payload: dict) -> Path:
    sidecar = target_path.with_suffix(".observer.json")
    sidecar.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")
    return sidecar


def process_yaml(config: ObserverConfig, source_path: Path) -> None:
    analysis_config = load_analysis_config()
    try:
        entry = load_yaml(source_path)
        if not isinstance(entry, dict):
            raise ValueError("root mapping not found")
        missing = validate_entry(entry)
        if missing:
            raise ValueError(f"missing keys: {', '.join(missing)}")

        target_path = target_record_path(config, source_path, entry)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        normalized_entry = copy_attachments(source_path, target_path, entry)
        write_yaml(target_path, normalized_entry)

        llm_path = mirrored_llm_path(config, target_path)
        llm_path.parent.mkdir(parents=True, exist_ok=True)
        write_yaml(llm_path, normalized_entry)

        outputs = write_analysis_outputs(analysis_config, target_path)
        sidecar = write_sidecar(
            outputs["memo"],
            {
                "sourcePath": str(source_path),
                "memoPath": str(outputs["memo"]),
                "questionPath": str(outputs.get("question", "")),
                "kpiPath": str(outputs.get("kpi", "")),
                "transcriptPath": str(outputs.get("transcript", "")),
                "edgePath": str(outputs.get("edge", "")),
                "processedAt": datetime.now(timezone.utc).isoformat(),
            },
        )
        append_log(config, f"processed {source_path} -> {outputs['memo']}")
        append_analysis_log(config.logs_root, f"observer sidecar {sidecar}")
    except Exception as error:
        route_to_dead_letter(analysis_config, source_path, str(error))
        append_log(config, f"failed {source_path} reason={error}")


def scan_once(config: ObserverConfig, seen: set[str]) -> None:
    for source_path in iter_yaml_files(config.host_inbox):
        source_key = str(source_path.resolve())
        if source_key in seen:
            continue
        process_yaml(config, source_path)
        seen.add(source_key)


def main() -> None:
    config = load_config()
    ensure_directories(config)
    seen: set[str] = set()
    append_log(config, "observer started")
    while True:
        scan_once(config, seen)
        time.sleep(config.poll_seconds)


if __name__ == "__main__":
    main()
