from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
LOGS = RUNTIME / "logs"


def count_yaml(path: Path) -> int:
    if not path.exists():
        return 0
    return len(list(path.rglob("*.yaml")))


def service_state(path: Path) -> str:
    return "ready" if path.exists() else "missing"


def build_snapshot() -> dict:
    host_inbox = RUNTIME / "host-inbox"
    records = RUNTIME / "records"
    llm_inbox = RUNTIME / "llm_inbox"

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "host": "Tezy-GT37",
        "edge": "Xperia 5 III",
        "counts": {
            "hostInboxYaml": count_yaml(host_inbox),
            "recordsYaml": count_yaml(records),
            "llmInboxYaml": count_yaml(llm_inbox),
        },
        "services": {
            "syncthing": service_state(RUNTIME / "syncthing"),
            "observer": service_state(LOGS / "observer.log"),
            "ollama": service_state(RUNTIME / "ollama"),
        },
    }


def main() -> None:
    LOGS.mkdir(parents=True, exist_ok=True)
    snapshot_path = LOGS / "status_snapshot.json"
    snapshot_path.write_text(json.dumps(build_snapshot(), indent=2), encoding="utf-8")
    print(snapshot_path)


if __name__ == "__main__":
    main()

