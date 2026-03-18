from __future__ import annotations

import json
import os
import shutil
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable


@dataclass(frozen=True)
class ObserverConfig:
    host_inbox: Path
    records_root: Path
    llm_inbox: Path
    logs_root: Path
    poll_seconds: int


def load_config() -> ObserverConfig:
    return ObserverConfig(
        host_inbox=Path(os.environ.get("ICLONE_HOST_INBOX", "runtime/host-inbox")),
        records_root=Path(os.environ.get("ICLONE_RECORDS_ROOT", "runtime/records")),
        llm_inbox=Path(os.environ.get("ICLONE_LLM_INBOX", "runtime/llm_inbox")),
        logs_root=Path(os.environ.get("ICLONE_LOGS_ROOT", "runtime/logs")),
        poll_seconds=int(os.environ.get("ICLONE_POLL_SECONDS", "3")),
    )


def ensure_directories(config: ObserverConfig) -> None:
    for path in (config.host_inbox, config.records_root, config.llm_inbox, config.logs_root):
        path.mkdir(parents=True, exist_ok=True)


def iter_yaml_files(root: Path) -> Iterable[Path]:
    if not root.exists():
        return []
    return root.rglob("*.yaml")


def read_simple_yaml(path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or line.startswith("- ") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"')
    return data


def target_record_path(config: ObserverConfig, source_path: Path, entry: Dict[str, str]) -> Path:
    project_id = entry.get("projectId", "unknown-project")
    captured_at = entry.get("capturedAt", "1970-01-01T00:00:00+00:00")
    dt = datetime.fromisoformat(captured_at.replace("Z", "+00:00"))
    session_id = entry.get("sessionId", "session-unknown")
    relative = Path(project_id) / f"{dt.year:04d}" / f"{dt.month:02d}" / session_id / source_path.name
    return config.records_root / relative


def mirrored_llm_path(config: ObserverConfig, target_path: Path) -> Path:
    relative = target_path.relative_to(config.records_root)
    return config.llm_inbox / relative


def append_log(config: ObserverConfig, message: str) -> None:
    stamp = datetime.now(timezone.utc).isoformat()
    log_file = config.logs_root / "observer.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with log_file.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")


def process_yaml(config: ObserverConfig, source_path: Path) -> None:
    entry = read_simple_yaml(source_path)
    target_path = target_record_path(config, source_path, entry)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_path, target_path)

    llm_path = mirrored_llm_path(config, target_path)
    llm_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_path, llm_path)

    sidecar = target_path.with_suffix(".observer.json")
    sidecar.write_text(
        json.dumps(
            {
                "sourcePath": str(source_path),
                "targetPath": str(target_path),
                "llmPath": str(llm_path),
                "processedAt": datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=True,
            indent=2,
        ),
        encoding="utf-8",
    )
    append_log(config, f"mirrored {source_path} -> {target_path}")


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

