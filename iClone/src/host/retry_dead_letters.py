from __future__ import annotations

import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEAD_LETTER = Path(os.environ.get("ICLONE_DEAD_LETTER_ROOT", ROOT / "runtime/dead-letter"))
HOST_INBOX = Path(os.environ.get("ICLONE_HOST_INBOX", ROOT / "runtime/host-inbox/xperia5iii-edge-001"))
LOGS = Path(os.environ.get("ICLONE_LOGS_ROOT", ROOT / "runtime/logs"))


def append_log(message: str) -> None:
    stamp = datetime.now(timezone.utc).isoformat()
    target = LOGS / "retry.log"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")


def main() -> None:
    DEAD_LETTER.mkdir(parents=True, exist_ok=True)
    HOST_INBOX.mkdir(parents=True, exist_ok=True)
    retried = 0
    for path in DEAD_LETTER.glob("*.yaml"):
        metadata_path = path.with_suffix(".deadletter.json")
        attempts = 0
        if metadata_path.exists():
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            attempts = int(metadata.get("retryCount", 0))
        target = HOST_INBOX / path.name
        shutil.copy2(path, target)
        if metadata_path.exists():
            metadata["retryCount"] = attempts + 1
            metadata["retriedAt"] = datetime.now(timezone.utc).isoformat()
            metadata_path.write_text(json.dumps(metadata, ensure_ascii=True, indent=2), encoding="utf-8")
        append_log(f"requeued {path} -> {target}")
        retried += 1

    print(f"retried={retried}")


if __name__ == "__main__":
    main()
