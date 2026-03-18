from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
LOGS = RUNTIME / "logs"


def count_yaml(path: Path) -> int:
    if not path.exists():
        return 0
    return len(list(path.rglob("*.yaml")))


def service_state(path: Path) -> str:
    return "ready" if path.exists() else "missing"


def tail_lines(path: Path, line_count: int = 5) -> list[str]:
    if not path.exists():
        return []
    return path.read_text(encoding="utf-8").splitlines()[-line_count:]


def count_files(path: Path, pattern: str) -> int:
    if not path.exists():
        return 0
    return len(list(path.rglob(pattern)))


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def build_snapshot() -> dict[str, Any]:
    host_inbox = RUNTIME / "host-inbox"
    records = RUNTIME / "records"
    llm_inbox = RUNTIME / "llm_inbox"
    edge_outbox = RUNTIME / "edge-outbox"
    dead_letter = RUNTIME / "dead-letter"
    observer_log = LOGS / "observer.log"
    analysis_log = LOGS / "analysis.log"
    retry_log = LOGS / "retry.log"
    adb_bridge_log = LOGS / "adb_bridge.log"
    adb_bridge_state = load_json(LOGS / "adb_bridge_state.json")

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "host": "Tezy-GT37",
        "edge": "Xperia 5 III",
        "counts": {
            "hostInboxYaml": count_yaml(host_inbox),
            "recordsYaml": count_yaml(records),
            "llmInboxYaml": count_yaml(llm_inbox),
            "edgeOutboxYaml": count_yaml(edge_outbox),
            "deadLetterYaml": count_yaml(dead_letter),
            "transcriptYaml": count_files(records, "transcript-*.yaml"),
            "kpiYaml": count_files(records, "kpi-*.yaml"),
            "questionYaml": count_files(records, "question-*.yaml"),
        },
        "services": {
            "syncthing": service_state(RUNTIME / "syncthing"),
            "observer": service_state(observer_log),
            "ollama": service_state(RUNTIME / "ollama"),
            "analysis": service_state(analysis_log),
            "retry": service_state(retry_log),
            "adbBridge": "connected" if adb_bridge_state.get("connected") else service_state(adb_bridge_log),
        },
        "health": {
            "observerTail": tail_lines(observer_log),
            "analysisTail": tail_lines(analysis_log),
            "retryTail": tail_lines(retry_log),
            "adbBridgeTail": tail_lines(adb_bridge_log),
            "deadLettersPresent": count_yaml(dead_letter) > 0,
            "reverseSyncReady": count_yaml(edge_outbox) > 0,
            "deviceConnected": bool(adb_bridge_state.get("connected")),
            "deviceSerial": adb_bridge_state.get("serial", ""),
            "mirroredEntries": adb_bridge_state.get("mirroredEntries", 0),
            "pushedQuestions": adb_bridge_state.get("pushedQuestions", 0),
        },
    }


def main() -> None:
    LOGS.mkdir(parents=True, exist_ok=True)
    snapshot = build_snapshot()
    snapshot_path = LOGS / "status_snapshot.json"
    script_path = LOGS / "status_snapshot.js"
    snapshot_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    script_path.write_text(
        "window.__ICLONE_STATUS_SNAPSHOT__ = "
        + json.dumps(snapshot, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(snapshot_path)
    print(script_path)


if __name__ == "__main__":
    main()
