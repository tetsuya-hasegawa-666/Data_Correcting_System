from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
RECORDS = RUNTIME / "records"
LOGS = RUNTIME / "logs"


def parse_simple_yaml(path: Path) -> dict:
    data: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or line.startswith("- ") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"')
    return data


def collect_entries() -> list[dict]:
    entries: list[dict] = []
    for path in sorted(RECORDS.rglob("*.yaml")):
        data = parse_simple_yaml(path)
        entry = {
            "path": str(path.relative_to(ROOT)),
            "entryId": data.get("entryId", path.stem),
            "entryType": data.get("entryType", "unknown"),
            "projectId": data.get("projectId", "unknown-project"),
            "capturedAt": data.get("capturedAt", ""),
            "body": data.get("body", ""),
            "suggestedMetric": data.get("suggestedMetric", ""),
            "nextQuestion": data.get("nextQuestion", ""),
        }
        entries.append(entry)
    return entries[-12:]


def build_snapshot() -> dict:
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "entries": collect_entries(),
    }


def main() -> None:
    LOGS.mkdir(parents=True, exist_ok=True)
    target = LOGS / "review_snapshot.json"
    target.write_text(json.dumps(build_snapshot(), ensure_ascii=False, indent=2), encoding="utf-8")
    print(target)


if __name__ == "__main__":
    main()

