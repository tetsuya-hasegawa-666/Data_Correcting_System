from __future__ import annotations

import shutil
from pathlib import Path

from build_review_snapshot import build_snapshot as build_review_snapshot
from build_status_snapshot import build_snapshot as build_status_snapshot
from observer import ensure_directories, load_config, scan_once
from retry_dead_letters import main as retry_dead_letters


ROOT = Path(__file__).resolve().parents[2]
SEED_ENTRY = ROOT / "data/seed/manager_context/records/project-alpha/2026/03/session-20260317-090000/entries/entry-20260317-090512.yaml"


def reset_runtime() -> None:
    for relative in [
        "runtime/host-inbox/xperia5iii-edge-001",
        "runtime/records",
        "runtime/llm_inbox",
        "runtime/edge-outbox",
        "runtime/dead-letter",
    ]:
        target = ROOT / relative
        if target.exists():
            shutil.rmtree(target)


def main() -> None:
    config = load_config()
    ensure_directories(config)
    reset_runtime()
    target = ROOT / "runtime/host-inbox/xperia5iii-edge-001/entry-20260317-090512.yaml"
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SEED_ENTRY, target)

    seen: set[str] = set()
    scan_once(config, seen)

    invalid = ROOT / "runtime/host-inbox/xperia5iii-edge-001/invalid-entry.yaml"
    invalid.write_text('schemaVersion: "1.0.0"\nentryType: "memo"\n', encoding="utf-8")
    scan_once(config, seen)
    retry_dead_letters()

    status = build_status_snapshot()
    review = build_review_snapshot()

    assert status["counts"]["recordsYaml"] >= 3, "records yaml count did not grow"
    assert status["counts"]["edgeOutboxYaml"] >= 1, "reverse sync payload missing"
    assert status["counts"]["questionYaml"] >= 1, "question output missing"
    assert status["counts"]["kpiYaml"] >= 1, "kpi output missing"
    assert status["counts"]["deadLetterYaml"] >= 1, "dead letter missing"
    assert review["records"], "context records missing"

    print("validation passed")
    print(f"recordsYaml={status['counts']['recordsYaml']}")
    print(f"edgeOutboxYaml={status['counts']['edgeOutboxYaml']}")
    print(f"contextRecords={len(review['records'])}")


if __name__ == "__main__":
    main()
