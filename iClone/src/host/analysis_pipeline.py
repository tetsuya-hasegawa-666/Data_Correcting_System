from __future__ import annotations

import hashlib
import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from yaml_tools import load_yaml, write_yaml


@dataclass(frozen=True)
class AnalysisConfig:
    records_root: Path
    llm_inbox: Path
    edge_outbox: Path
    dead_letter_root: Path
    logs_root: Path
    host_device_id: str
    host_peer_id: str


def load_analysis_config() -> AnalysisConfig:
    return AnalysisConfig(
        records_root=Path(os.environ.get("ICLONE_RECORDS_ROOT", "runtime/records")),
        llm_inbox=Path(os.environ.get("ICLONE_LLM_INBOX", "runtime/llm_inbox")),
        edge_outbox=Path(os.environ.get("ICLONE_EDGE_OUTBOX", "runtime/edge-outbox")),
        dead_letter_root=Path(os.environ.get("ICLONE_DEAD_LETTER_ROOT", "runtime/dead-letter")),
        logs_root=Path(os.environ.get("ICLONE_LOGS_ROOT", "runtime/logs")),
        host_device_id=os.environ.get("ICLONE_HOST_DEVICE_ID", "windows-host-primary"),
        host_peer_id=os.environ.get("ICLONE_HOST_PEER_ID", "SYNCTHING-HOST-001"),
    )


def append_log(logs_root: Path, message: str) -> None:
    stamp = datetime.now(timezone.utc).isoformat()
    target = logs_root / "analysis.log"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")


def route_to_dead_letter(config: AnalysisConfig, source_path: Path, reason: str) -> Path:
    target = config.dead_letter_root / source_path.name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(source_path.read_text(encoding="utf-8"), encoding="utf-8")
    metadata = target.with_suffix(".deadletter.json")
    metadata.write_text(
        json.dumps(
            {
                "sourcePath": str(source_path),
                "reason": reason,
                "movedAt": datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=True,
            indent=2,
        ),
        encoding="utf-8",
    )
    append_log(config.logs_root, f"dead-lettered {source_path} reason={reason}")
    return target


def derive_headline(entry: dict[str, Any]) -> str:
    if entry.get("headline"):
        return str(entry["headline"])
    input_mode = str(entry.get("inputMode", "text"))
    body = str(entry.get("body", "")).strip()
    prefix = {
        "voice": "音声",
        "photo": "画像",
        "mixed": "メモ",
        "text": "メモ",
    }.get(input_mode, "メモ")
    body_part = body[:24] if body else "内容未設定"
    return f"{prefix}: {body_part}"


def validate_entry(data: dict[str, Any]) -> list[str]:
    required = ["entryId", "entryType", "projectId", "sessionId", "capturedAt", "deviceId"]
    missing = [key for key in required if not data.get(key)]
    return missing


def slug_from_entry_id(entry_id: str) -> str:
    return entry_id.replace("entry-", "")


def stable_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:10]


def build_transcript(entry: dict[str, Any], config: AnalysisConfig) -> dict[str, Any] | None:
    attachments = entry.get("attachments") or []
    has_audio = any(str(item.get("mimeType", "")).startswith("audio/") for item in attachments if isinstance(item, dict))
    if not has_audio:
        return None

    entry_id = str(entry["entryId"])
    base_body = str(entry.get("body", ""))
    transcript_body = f"文字起こし要約: {base_body}"
    return {
        "schemaVersion": "1.0.0",
        "entryId": f"transcript-{slug_from_entry_id(entry_id)}",
        "entryType": "transcript",
        "projectId": entry["projectId"],
        "sessionId": entry["sessionId"],
        "capturedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "deviceId": config.host_device_id,
        "inputMode": "voice",
        "headline": f"音声: {base_body[:20] or '要点抽出'}",
        "body": transcript_body,
        "projectContext": entry.get("projectContext", {}),
        "sync": {
            "peerId": config.host_peer_id,
            "state": "host_generated",
        },
        "sourceEntryId": entry_id,
    }


def build_question(entry: dict[str, Any], config: AnalysisConfig) -> dict[str, Any]:
    body = str(entry.get("body", ""))
    topic = str(entry.get("projectContext", {}).get("topic", "current_issue")).replace("_", " ")
    if "待ち" in body:
        question_body = "その待ち時間は、誰の判断待ちと準備不足のどちらが主因でしたか。"
    elif "遅れ" in body:
        question_body = "遅れを最も強く作っていた工程はどこでしたか。"
    else:
        question_body = f"{topic} について、いま最も繰り返し発生している詰まりは何ですか。"

    question_id = f"question-{slug_from_entry_id(str(entry['entryId']))}"
    return {
        "schemaVersion": "1.0.0",
        "entryId": question_id,
        "entryType": "question",
        "projectId": entry["projectId"],
        "sessionId": entry["sessionId"],
        "capturedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "deviceId": config.host_device_id,
        "inputMode": "text",
        "headline": "次の質問",
        "body": question_body,
        "projectContext": {
            "relatedEntryId": entry["entryId"],
            **(entry.get("projectContext") or {}),
        },
        "sync": {
            "peerId": config.host_peer_id,
            "state": "ready_for_edge",
        },
    }


def build_kpi_candidate(entry: dict[str, Any], question: dict[str, Any]) -> dict[str, Any]:
    body = str(entry.get("body", ""))
    topic = str(entry.get("projectContext", {}).get("topic", "onsite_delay")).replace("_", " ")
    metric = "平均判断待ち時間（分）" if "待ち" in body else f"{topic} 関連滞留件数"
    hypothesis = (
        "現場開始前の判断待ちが主要 KPI 候補である。"
        if "待ち" in body
        else f"{topic} の再発頻度を主要 KPI 候補として追跡する。"
    )
    candidate_id = f"kpi-{stable_hash(entry['entryId'] + question['entryId'])}"
    return {
        "schemaVersion": "1.0.0",
        "candidateId": candidate_id,
        "projectId": entry["projectId"],
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(),
        "hypothesis": hypothesis,
        "evidenceEntryIds": [entry["entryId"]],
        "suggestedMetric": metric,
        "nextQuestion": question["body"],
    }


def derived_directory(record_path: Path) -> Path:
    return record_path.parent / "derived"


def entries_directory(record_path: Path) -> Path:
    return record_path.parent / "entries"


def ensure_record_layout(record_path: Path) -> tuple[Path, Path]:
    entries_dir = entries_directory(record_path)
    derived_dir = derived_directory(record_path)
    entries_dir.mkdir(parents=True, exist_ok=True)
    derived_dir.mkdir(parents=True, exist_ok=True)
    return entries_dir, derived_dir


def write_edge_payload(config: AnalysisConfig, question: dict[str, Any]) -> Path:
    project_id = str(question["projectId"])
    session_id = str(question["sessionId"])
    target = config.edge_outbox / project_id / session_id / f"{question['entryId']}.yaml"
    write_yaml(target, question)
    return target


def write_analysis_outputs(config: AnalysisConfig, record_path: Path) -> dict[str, Path]:
    entry = load_yaml(record_path)
    if not isinstance(entry, dict):
        raise ValueError("root is not a mapping")
    missing = validate_entry(entry)
    if missing:
        raise ValueError(f"missing keys: {', '.join(missing)}")

    entry["headline"] = derive_headline(entry)
    write_yaml(record_path, entry)

    entries_dir, derived_dir = ensure_record_layout(record_path)
    memo_target = entries_dir / record_path.name
    if memo_target != record_path:
        write_yaml(memo_target, entry)
        if record_path.exists():
            record_path.unlink()

    transcript = build_transcript(entry, config)
    question = build_question(entry, config)
    kpi_candidate = build_kpi_candidate(entry, question)

    outputs: dict[str, Path] = {"memo": memo_target}
    if transcript is not None:
        transcript_path = derived_dir / f"{transcript['entryId']}.yaml"
        write_yaml(transcript_path, transcript)
        outputs["transcript"] = transcript_path

    question_path = entries_dir / f"{question['entryId']}.yaml"
    write_yaml(question_path, question)
    outputs["question"] = question_path

    kpi_path = derived_dir / f"{kpi_candidate['candidateId']}.yaml"
    write_yaml(kpi_path, kpi_candidate)
    outputs["kpi"] = kpi_path

    edge_path = write_edge_payload(config, question)
    outputs["edge"] = edge_path

    manifest_path = derived_dir / f"analysis-{stable_hash(str(memo_target))}.json"
    manifest_path.write_text(
        json.dumps(
            {
                "source": str(memo_target),
                "question": str(question_path),
                "kpi": str(kpi_path),
                "transcript": str(outputs.get("transcript", "")),
                "edgePayload": str(edge_path),
                "generatedAt": datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=True,
            indent=2,
        ),
        encoding="utf-8",
    )
    outputs["manifest"] = manifest_path

    append_log(config.logs_root, f"analyzed {memo_target}")
    return outputs
