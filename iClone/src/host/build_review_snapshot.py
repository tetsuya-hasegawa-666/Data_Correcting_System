from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from yaml_tools import load_yaml


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / "runtime"
RECORDS = RUNTIME / "records"
LOGS = RUNTIME / "logs"


def relative_to_root(path: Path) -> str:
    return str(path.relative_to(ROOT))


def collect_yaml_entries(root: Path) -> list[tuple[Path, dict[str, Any]]]:
    entries: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(root.rglob("*.yaml")):
        data = load_yaml(path)
        if isinstance(data, dict):
            entries.append((path, data))
    return entries


def index_entries(entries: list[tuple[Path, dict[str, Any]]]) -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    by_entry_id: dict[str, dict[str, Any]] = {}
    by_candidate_id: dict[str, dict[str, Any]] = {}
    for path, data in entries:
        if data.get("entryId"):
            by_entry_id[str(data["entryId"])] = {"path": path, "data": data}
        if data.get("candidateId"):
            by_candidate_id[str(data["candidateId"])] = {"path": path, "data": data}
    return by_entry_id, by_candidate_id


def normalize_attachments(attachments: Any) -> list[dict[str, Any]]:
    if not isinstance(attachments, list):
        return []
    normalized: list[dict[str, Any]] = []
    for item in attachments:
        if isinstance(item, dict):
            normalized.append(
                {
                    "attachmentId": item.get("attachmentId", ""),
                    "path": item.get("path", ""),
                    "mimeType": item.get("mimeType", ""),
                    "previewUrl": "",
                }
            )
    return normalized


def build_context_records() -> list[dict[str, Any]]:
    collected = collect_yaml_entries(RECORDS)
    by_entry_id, by_candidate_id = index_entries(collected)
    records: list[dict[str, Any]] = []

    for path, data in collected:
        if str(data.get("entryType")) != "memo":
            continue

        related_questions: list[dict[str, Any]] = []
        related_kpis: list[dict[str, Any]] = []
        related_transcripts: list[dict[str, Any]] = []

        ai = data.get("ai") or {}
        for question_id in ai.get("nextQuestionIds", []):
            item = by_entry_id.get(str(question_id))
            if item:
                related_questions.append(
                    {
                        "entryId": item["data"].get("entryId", ""),
                        "body": item["data"].get("body", ""),
                        "path": relative_to_root(item["path"]),
                    }
                )

        for candidate_id in ai.get("kpiCandidateIds", []):
            item = by_candidate_id.get(str(candidate_id))
            if item:
                related_kpis.append(
                    {
                        "candidateId": item["data"].get("candidateId", ""),
                        "hypothesis": item["data"].get("hypothesis", ""),
                        "suggestedMetric": item["data"].get("suggestedMetric", ""),
                        "path": relative_to_root(item["path"]),
                    }
                )

        session_root = path.parent.parent
        for transcript_path in sorted((session_root / "derived").glob("transcript-*.yaml")):
            transcript = load_yaml(transcript_path)
            if isinstance(transcript, dict) and str(transcript.get("sourceEntryId")) == str(data.get("entryId")):
                related_transcripts.append(
                    {
                        "entryId": transcript.get("entryId", ""),
                        "headline": transcript.get("headline", ""),
                        "body": transcript.get("body", ""),
                        "path": relative_to_root(transcript_path),
                    }
                )

        if not related_questions:
            for item in by_entry_id.values():
                question_data = item["data"]
                project_context = question_data.get("projectContext") or {}
                if str(question_data.get("entryType")) == "question" and str(project_context.get("relatedEntryId")) == str(data.get("entryId")):
                    related_questions.append(
                        {
                            "entryId": question_data.get("entryId", ""),
                            "body": question_data.get("body", ""),
                            "path": relative_to_root(item["path"]),
                        }
                    )

        if not related_kpis:
            for item in by_candidate_id.values():
                candidate_data = item["data"]
                if str(data.get("entryId")) in [str(value) for value in candidate_data.get("evidenceEntryIds", [])]:
                    related_kpis.append(
                        {
                            "candidateId": candidate_data.get("candidateId", ""),
                            "hypothesis": candidate_data.get("hypothesis", ""),
                            "suggestedMetric": candidate_data.get("suggestedMetric", ""),
                            "path": relative_to_root(item["path"]),
                        }
                    )

        records.append(
            {
                "entryId": data.get("entryId", path.stem),
                "headline": data.get("headline", ""),
                "projectId": data.get("projectId", "unknown-project"),
                "capturedAt": data.get("capturedAt", ""),
                "body": data.get("body", ""),
                "inputMode": data.get("inputMode", ""),
                "syncState": (data.get("sync") or {}).get("state", "unknown"),
                "path": relative_to_root(path),
                "attachments": normalize_attachments(data.get("attachments")),
                "questions": related_questions,
                "kpiCandidates": related_kpis,
                "transcripts": related_transcripts,
            }
        )

        for attachment in records[-1]["attachments"]:
            attachment_path = path.parent / str(attachment.get("path", ""))
            if not attachment_path.exists():
                attachment_path = path.parent.parent / str(attachment.get("path", ""))
            if attachment_path.exists():
                attachment["previewUrl"] = "/" + relative_to_root(attachment_path).replace("\\", "/")

    return records[-12:]


def build_snapshot() -> dict[str, Any]:
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "records": build_context_records(),
    }


def main() -> None:
    LOGS.mkdir(parents=True, exist_ok=True)
    snapshot = build_snapshot()
    target = LOGS / "review_snapshot.json"
    script_target = LOGS / "review_snapshot.js"
    target.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    script_target.write_text(
        "window.__ICLONE_REVIEW_SNAPSHOT__ = "
        + json.dumps(snapshot, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(target)
    print(script_target)


if __name__ == "__main__":
    main()
