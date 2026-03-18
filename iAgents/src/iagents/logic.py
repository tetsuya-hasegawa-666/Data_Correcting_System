from __future__ import annotations

import csv
import io
import re
from dataclasses import dataclass
from typing import Iterable


RANGE_RE = re.compile(
    r"^(?:(?P<sheet>[^!]+)!)?(?P<start_col>[A-Z]+)(?P<start_row>\d+)(?::(?P<end_col>[A-Z]+)(?P<end_row>\d+))?$"
)
NORMALIZE_HEADER_RE = re.compile(r"[^a-z0-9]+")


@dataclass(slots=True)
class RangeRef:
    sheet: str | None
    start_col: int
    start_row: int
    end_col: int
    end_row: int


def column_to_index(column: str) -> int:
    value = 0
    for char in column.upper():
        value = value * 26 + (ord(char) - ord("A") + 1)
    return value


def index_to_column(index: int) -> str:
    if index < 1:
        raise ValueError("Column index must be positive")
    chars: list[str] = []
    current = index
    while current:
        current, remainder = divmod(current - 1, 26)
        chars.append(chr(ord("A") + remainder))
    return "".join(reversed(chars))


def parse_range(range_text: str) -> RangeRef:
    match = RANGE_RE.match(range_text.strip())
    if not match:
        raise ValueError(f"Unsupported range: {range_text}")
    start_col = column_to_index(match.group("start_col"))
    start_row = int(match.group("start_row"))
    end_col = column_to_index(match.group("end_col") or match.group("start_col"))
    end_row = int(match.group("end_row") or match.group("start_row"))
    return RangeRef(
        sheet=match.group("sheet"),
        start_col=min(start_col, end_col),
        start_row=min(start_row, end_row),
        end_col=max(start_col, end_col),
        end_row=max(start_row, end_row),
    )


def format_range(ref: RangeRef) -> str:
    start = f"{index_to_column(ref.start_col)}{ref.start_row}"
    end = f"{index_to_column(ref.end_col)}{ref.end_row}"
    prefix = f"{ref.sheet}!" if ref.sheet else ""
    return f"{prefix}{start}" if start == end else f"{prefix}{start}:{end}"


def _range_size(ref: RangeRef) -> tuple[int, int]:
    return ref.end_row - ref.start_row + 1, ref.end_col - ref.start_col + 1


def _focus_cell(ref: RangeRef) -> str:
    row_center = ref.start_row + (ref.end_row - ref.start_row) // 2
    col_center = ref.start_col + (ref.end_col - ref.start_col) // 2
    prefix = f"{ref.sheet}!" if ref.sheet else ""
    return f"{prefix}{index_to_column(col_center)}{row_center}"


def _corner_cells(ref: RangeRef) -> dict[str, str]:
    prefix = f"{ref.sheet}!" if ref.sheet else ""
    return {
        "top_left": f"{prefix}{index_to_column(ref.start_col)}{ref.start_row}",
        "top_right": f"{prefix}{index_to_column(ref.end_col)}{ref.start_row}",
        "bottom_left": f"{prefix}{index_to_column(ref.start_col)}{ref.end_row}",
        "bottom_right": f"{prefix}{index_to_column(ref.end_col)}{ref.end_row}",
    }


def suggest_range(range_text: str, visible_rows: int = 20, visible_cols: int = 8) -> dict:
    current = parse_range(range_text)
    rows, cols = _range_size(current)
    header_row = max(1, current.start_row - 1)
    snap = RangeRef(
        sheet=current.sheet,
        start_col=current.start_col,
        start_row=header_row,
        end_col=max(current.end_col, current.start_col + max(visible_cols - 1, cols - 1)),
        end_row=max(current.end_row, current.start_row + max(visible_rows - 1, rows - 1)),
    )
    body = RangeRef(
        sheet=current.sheet,
        start_col=snap.start_col,
        start_row=min(snap.end_row, snap.start_row + 1),
        end_col=snap.end_col,
        end_row=snap.end_row,
    )
    return {
        "current_range": format_range(current),
        "focus_cell": _focus_cell(current),
        "selection_size": {"rows": rows, "cols": cols},
        "smart_snap_range": format_range(snap),
        "data_body_range": format_range(body),
        "pip_preview": {
            "range": format_range(snap),
            "corners": _corner_cells(snap),
            "summary": f"{rows}x{cols} の選択を、画面外も含めて {snap.end_row - snap.start_row + 1}x{snap.end_col - snap.start_col + 1} に拡張候補化",
        },
        "notes": [
            "Range Pilot は現在位置を保ったまま候補だけを広げます。",
            "Smart Snap は 1 行上を header 候補として含めます。",
            "実 Excel への適用前に companion app 上で候補確認できます。",
        ],
    }


def selection_time_machine(history: Iterable[str], new_range: str) -> dict:
    normalized_new = new_range.strip()
    if not normalized_new:
        raise ValueError("new_range is required")
    normalized_history = [item.strip() for item in history if item and item.strip()]
    updated = [normalized_new, *[item for item in normalized_history if item != normalized_new]][:5]
    restore_offer = updated[1] if len(updated) > 1 else None
    return {
        "history": updated,
        "restore_offer": restore_offer,
        "restore_label": f"{restore_offer} を復元" if restore_offer else "復元候補なし",
        "notes": [
            "直前 5 件までの選択を保持します。",
            "誤クリック後は直前候補を復元ボタンとして提示できます。",
        ],
    }


def smart_snap_preview(range_text: str, occupied_rows: int = 20, occupied_cols: int = 8) -> dict:
    current = parse_range(range_text)
    target = RangeRef(
        sheet=current.sheet,
        start_col=current.start_col,
        start_row=max(1, current.start_row - 1),
        end_col=max(current.end_col, current.start_col + occupied_cols - 1),
        end_row=max(current.end_row, current.start_row + occupied_rows - 1),
    )
    missing_top = current.start_row > target.start_row
    missing_right = current.end_col < target.end_col
    missing_bottom = current.end_row < target.end_row
    confidence = 0.52
    if missing_top:
        confidence += 0.15
    if missing_right:
        confidence += 0.13
    if missing_bottom:
        confidence += 0.13
    confidence = min(confidence, 0.94)
    gaps = []
    if missing_top:
        gaps.append("header 行")
    if missing_right:
        gaps.append("右端列")
    if missing_bottom:
        gaps.append("下端行")
    return {
        "current_range": format_range(current),
        "ghost_range": format_range(target),
        "confidence": round(confidence, 2),
        "missing_segments": gaps,
        "reason": " / ".join(gaps) if gaps else "選択は既に十分です",
    }


def _parse_delimited_table(text: str) -> list[list[str]]:
    stripped = text.strip()
    if not stripped:
        return []
    blocks = [block for block in re.split(r"\n\s*\n", stripped) if block.strip()]
    if len(blocks) > 1:
        rows: list[list[str]] = []
        for block in blocks:
            rows.extend(_parse_delimited_table(block))
        return rows
    markdown_lines = [line for line in stripped.splitlines() if line.strip()]
    if markdown_lines and all(line.strip().startswith("|") and line.strip().endswith("|") for line in markdown_lines):
        rows = []
        for line in markdown_lines:
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if all(set(cell) <= {"-", ":"} for cell in cells):
                continue
            rows.append(cells)
        return rows
    delimiter = "\t" if "\t" in stripped else ","
    reader = csv.reader(io.StringIO(stripped), delimiter=delimiter)
    return [[cell.strip() for cell in row] for row in reader if any(cell.strip() for cell in row)]


def _single_cell_formula(text: str) -> str:
    chunks = [chunk.replace('"', '""') for chunk in text.replace("\r\n", "\n").split("\n")]
    return "=" + "&CHAR(10)&".join(f'"{chunk}"' for chunk in chunks)


def clean_paste(text: str, single_cell: bool = False) -> dict:
    normalized = text.strip().replace("\r\n", "\n")
    table = _parse_delimited_table(normalized)
    if table and len(table) > 1 and max(len(row) for row in table) > 1:
        width = max(len(row) for row in table)
        normalized_table = [row + [""] * (width - len(row)) for row in table]
        normalized_tsv = "\n".join("\t".join(row) for row in normalized_table)
        return {
            "mode": "table",
            "normalized_text": normalized_tsv,
            "row_count": len(normalized_table),
            "column_count": width,
            "single_cell_formula": _single_cell_formula(normalized),
            "format_suggestions": ["列幅自動調整", "ヘッダー罫線", "数値列右寄せ"],
            "notes": [
                "Excel Online に貼りやすい TSV に正規化しました。",
                "複数ブロックや Markdown 表も 1 つの表として吸収します。",
            ],
        }
    return {
        "mode": "single_cell" if single_cell or "\n" in normalized else "plain_text",
        "normalized_text": normalized if not single_cell else normalized.replace("\n", " / "),
        "row_count": 1,
        "column_count": 1,
        "single_cell_formula": _single_cell_formula(normalized),
        "format_suggestions": ["折り返して全体を表示"],
        "notes": ["改行を保持したまま 1 セルへ入れる式も出せます。"],
    }


def _normalize_header(header: str) -> str:
    lowered = header.strip().lower()
    lowered = lowered.replace("金額", "amount").replace("売上", "sales").replace("利益", "profit")
    lowered = lowered.replace("月", "month").replace("担当", "owner").replace("部門", "department")
    return NORMALIZE_HEADER_RE.sub("", lowered)


def synthesize_datasets(datasets: Iterable[str]) -> dict:
    parsed = [_parse_delimited_table(dataset) for dataset in datasets if dataset.strip()]
    parsed = [table for table in parsed if table]
    if not parsed:
        return {"headers": [], "rows": [], "match_report": [], "notes": ["データがありません。"]}

    canonical_headers: list[str] = []
    alias_map: dict[str, str] = {}
    match_report: list[dict[str, str]] = []
    for table_index, table in enumerate(parsed, start=1):
        headers = table[0]
        for header in headers:
            normalized = _normalize_header(header)
            if normalized in alias_map:
                canonical = alias_map[normalized]
            else:
                canonical = header.strip() or f"column_{len(canonical_headers) + 1}"
                alias_map[normalized] = canonical
                canonical_headers.append(canonical)
            match_report.append(
                {
                    "dataset": f"dataset_{table_index}",
                    "original": header,
                    "normalized": normalized,
                    "canonical": canonical,
                }
            )

    merged_rows: list[dict[str, str]] = []
    for table in parsed:
        headers = table[0]
        mapped_headers = [alias_map[_normalize_header(header)] for header in headers]
        for row in table[1:]:
            row_map = {header: "" for header in canonical_headers}
            for index, value in enumerate(row):
                if index < len(mapped_headers):
                    row_map[mapped_headers[index]] = value
            merged_rows.append(row_map)

    return {
        "headers": canonical_headers,
        "rows": merged_rows,
        "match_report": match_report,
        "notes": [
            "列名ゆれを吸収して canonical header へ寄せました。",
            "統合結果は新しいシートや新しいブックへ貼る前提です。",
        ],
    }


def _is_number(value: str) -> bool:
    try:
        float(value.replace(",", ""))
        return True
    except ValueError:
        return False


def suggest_chart(table_text: str) -> dict:
    table = _parse_delimited_table(table_text)
    if len(table) < 2:
        return {
            "chart_family": "none",
            "title": "表データが不足しています",
            "variants": [],
            "recommendations": ["ヘッダー行と 1 行以上のデータを入れてください。"],
        }

    headers = table[0]
    numeric_indices: list[int] = []
    for index in range(len(headers)):
        values = [row[index] for row in table[1:] if index < len(row)]
        if values and all(_is_number(value) for value in values):
            numeric_indices.append(index)

    label_index = 0
    if not numeric_indices:
        family = "table"
        variants = ["table highlight"]
        recommendations = ["数値列がないため、まず数値を含む表へ整形してください。"]
    elif len(numeric_indices) == 1:
        family = "bar"
        variants = ["clustered bar", "lollipop", "column"]
        recommendations = [
            f"{headers[label_index]} をラベル、{headers[numeric_indices[0]]} を値にした棒グラフが自然です。",
            "値ラベルを上に置くと確認が速いです。",
        ]
    else:
        family = "line"
        variants = ["line", "area", "combo"]
        recommendations = [
            f"{headers[label_index]} を横軸にして複数系列を重ねるのが自然です。",
            "主系列と補助系列を分けるなら combo を検討してください。",
        ]

    editor_labels = [
        {"target": "title", "label": "タイトル", "action": "タイトル文を短くする"},
        {"target": "legend", "label": "凡例", "action": "系列名を列見出しへ合わせる"},
        {"target": "axis", "label": "軸", "action": "単位を明記する"},
        {"target": "series", "label": "系列色", "action": "主系列を濃く、補助系列を薄くする"},
    ]
    return {
        "chart_family": family,
        "title": "Graph Shadow Editor recommendation",
        "numeric_columns": [headers[index] for index in numeric_indices],
        "variants": variants,
        "editor_labels": editor_labels,
        "recommendations": recommendations,
    }


def mode_halo_state(mode: str, ime_state: str = "auto") -> dict:
    normalized_mode = mode.strip().lower()
    palette = {
        "input": {"halo": "teal", "label": "入力", "hint": "通常入力モードです。"},
        "edit": {"halo": "amber", "label": "編集", "hint": "セル内編集中です。"},
        "formula": {"halo": "indigo", "label": "数式", "hint": "先頭の = を確認してください。"},
        "selection": {"halo": "slate", "label": "選択", "hint": "入力前に範囲だけが選ばれています。"},
    }
    data = palette.get(normalized_mode, {"halo": "gray", "label": mode or "不明", "hint": "状態未判定です。"})
    ime_label = {"full": "全角", "half": "半角", "auto": "自動"}.get(ime_state, ime_state)
    return {
        "mode": data["label"],
        "halo_color": data["halo"],
        "ime_state": ime_label,
        "message": f"{data['hint']} IME は {ime_label} です。",
    }


def build_action_handoff(command: str, bridge_state: dict, assist_payload: dict | None = None) -> dict:
    selection = str(bridge_state.get("selection", "")).strip()
    workbook_name = str(bridge_state.get("workbook_name", "")).strip() or "current workbook"
    worksheet_name = str(bridge_state.get("worksheet_name", "")).strip() or "current sheet"
    checklist = [
        f"{workbook_name} / {worksheet_name} を確認する",
        f"対象 selection を確認する: {selection or '未取得'}",
        "assistant の提案を見てから Excel Online 側で反映する",
    ]
    if assist_payload and assist_payload.get("target_range"):
        checklist.append(f"target range 候補: {assist_payload['target_range']}")
    return {
        "command": command,
        "workbook_name": workbook_name,
        "worksheet_name": worksheet_name,
        "selection": selection,
        "checklist": checklist,
        "copy_hint": selection or "",
    }


def build_dataset_handoff(bridge_state: dict, synth_payload: dict) -> dict:
    workbook_name = str(bridge_state.get("workbook_name", "")).strip() or "current workbook"
    worksheet_name = str(bridge_state.get("worksheet_name", "")).strip() or "current sheet"
    return {
        "workbook_name": workbook_name,
        "worksheet_name": worksheet_name,
        "target": "new sheet",
        "headers": synth_payload.get("headers", []),
        "row_count": len(synth_payload.get("rows", [])),
        "checklist": [
            f"{workbook_name} に新しい sheet を作る",
            "統合 headers を 1 行目へ貼る",
            "統合 rows を 2 行目以降へ貼る",
        ],
    }


def suggest_chart_live(bridge_state: dict) -> dict:
    table_preview = bridge_state.get("table_preview", [])
    if not table_preview:
        return {
            "status": "waiting_for_table_preview",
            "notes": ["bridge から table preview がまだ届いていません。"],
        }
    table_text = "\n".join(",".join(str(cell) for cell in row) for row in table_preview)
    result = suggest_chart(table_text)
    result["status"] = "ready"
    result["table_preview"] = table_preview
    result["action_handoff"] = {
        "workbook_name": bridge_state.get("workbook_name", "") or "current workbook",
        "selection": bridge_state.get("selection", ""),
        "checklist": [
            "グラフ元の表が正しいか確認する",
            "候補 family を選ぶ",
            "タイトル、凡例、軸の順に調整する",
        ],
    }
    return result


def build_live_assist(bridge_state: dict) -> dict:
    selection = str(bridge_state.get("selection", "")).strip()
    mode = str(bridge_state.get("mode", "")).strip() or "selection"
    ime_state = str(bridge_state.get("ime_state", "auto")).strip() or "auto"
    result = {
        "bridge_state": bridge_state,
        "halo": mode_halo_state(mode, ime_state),
        "range_assist": None,
        "snap_assist": None,
        "selection_recovery": None,
        "action_handoff": None,
        "status": "idle",
    }
    if not selection:
        result["status"] = "waiting_for_selection"
        return result
    try:
        result["range_assist"] = suggest_range(selection)
        result["snap_assist"] = smart_snap_preview(selection)
        history = bridge_state.get("selection_history", [])
        result["selection_recovery"] = {
            "history": history,
            "restore_offer": history[1] if len(history) > 1 else None,
        }
        result["action_handoff"] = build_action_handoff("review current selection", bridge_state, result["range_assist"])
        result["status"] = "ready"
    except ValueError:
        result["status"] = "selection_unreadable"
    return result


def interpret_intent(command: str, current_range: str | None = None) -> dict:
    normalized = command.strip().lower()
    action = "suggest"
    target_range = current_range
    details = "意図を候補化しました。"
    next_steps = ["候補を確認してから Excel Online へ反映してください。"]

    if any(token in normalized for token in ["一番下", "last row", "bottom", "最後まで"]):
        action = "extend_down"
        details = "選択範囲を下方向へ広げる意図として解釈しました。"
        next_steps = ["Range Pilot の候補を確認", "必要なら Smart Snap で確定"]
        if current_range:
            target_range = suggest_range(current_range)["smart_snap_range"]
    elif any(token in normalized for token in ["合計", "sum", "total"]):
        action = "sum"
        details = "数値列の合計を出したい意図として解釈しました。"
        next_steps = ["合計対象の列を確認", "末尾行または別セルへ SUM を入れる"]
    elif any(token in normalized for token in ["グラフ", "chart", "bar", "line"]):
        action = "chart"
        details = "グラフ作成の意図として解釈しました。"
        next_steps = ["Graph Shadow Editor で候補比較", "ラベルと軸を調整"]
    elif any(token in normalized for token in ["貼り付け", "paste", "clean", "整形"]):
        action = "clean_paste"
        details = "貼り付け前にデータを整えたい意図として解釈しました。"
        next_steps = ["Clean Paste で正規化", "TSV または 1 セル式を選ぶ"]
    elif any(token in normalized for token in ["統合", "merge", "combine"]):
        action = "synthesize"
        details = "複数表を統合したい意図として解釈しました。"
        next_steps = ["Data Synthesizer で列対応確認", "統合結果を新しいシートへ貼る"]
    elif any(token in normalized for token in ["戻す", "restore", "復元"]):
        action = "restore_selection"
        details = "直前の選択復元意図として解釈しました。"
        next_steps = ["Selection History の先頭候補を復元", "再度誤クリックしないよう確認"]

    return {
        "action": action,
        "details": details,
        "target_range": target_range,
        "next_steps": next_steps,
        "safety_note": "自動実行はせず、提案だけを返します。",
    }


def interpret_intent_with_bridge(command: str, bridge_state: dict) -> dict:
    selection = str(bridge_state.get("selection", "")).strip() or None
    result = interpret_intent(command, selection)
    result["bridge_context"] = {
        "workbook_name": bridge_state.get("workbook_name", ""),
        "worksheet_name": bridge_state.get("worksheet_name", ""),
        "selection": selection,
        "mode": bridge_state.get("mode", ""),
    }
    result["action_handoff"] = build_action_handoff(command, bridge_state, result)
    return result
