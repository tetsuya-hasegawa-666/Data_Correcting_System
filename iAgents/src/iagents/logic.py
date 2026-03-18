from __future__ import annotations

import csv
import io
import re
from dataclasses import dataclass
from typing import Iterable


RANGE_RE = re.compile(
    r"^(?:(?P<sheet>[^!]+)!)?(?P<start_col>[A-Z]+)(?P<start_row>\d+)(?::(?P<end_col>[A-Z]+)(?P<end_row>\d+))?$"
)


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


def suggest_range(range_text: str, visible_rows: int = 20, visible_cols: int = 8) -> dict:
    current = parse_range(range_text)
    header_row = max(1, current.start_row - 1)
    table_guess = RangeRef(
        sheet=current.sheet,
        start_col=current.start_col,
        start_row=header_row,
        end_col=max(current.end_col, current.start_col + max(visible_cols - 1, 0)),
        end_row=max(current.end_row, current.start_row + max(visible_rows - 1, 0)),
    )
    data_body = RangeRef(
        sheet=current.sheet,
        start_col=table_guess.start_col,
        start_row=min(table_guess.end_row, table_guess.start_row + 1),
        end_col=table_guess.end_col,
        end_row=table_guess.end_row,
    )
    return {
        "current_range": format_range(current),
        "smart_snap_range": format_range(table_guess),
        "data_body_range": format_range(data_body),
        "notes": [
            "開始位置の 1 行上を header 候補として扱いました。",
            "表示想定行数と列数から Smart Snap の拡張範囲を提案しました。",
            "Excel Online 上では名前ボックスの range を手入力または貼り付けて使います。",
        ],
    }


def _parse_delimited_table(text: str) -> list[list[str]]:
    stripped = text.strip()
    if not stripped:
        return []
    markdown_lines = [line for line in stripped.splitlines() if line.strip()]
    if markdown_lines and all(line.strip().startswith("|") and line.strip().endswith("|") for line in markdown_lines):
        table: list[list[str]] = []
        for line in markdown_lines:
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if all(set(cell) <= {"-", ":"} for cell in cells):
                continue
            table.append(cells)
        return table
    delimiter = "\t" if "\t" in stripped else ","
    reader = csv.reader(io.StringIO(stripped), delimiter=delimiter)
    return [[cell.strip() for cell in row] for row in reader if any(cell.strip() for cell in row)]


def clean_paste(text: str, single_cell: bool = False) -> dict:
    table = _parse_delimited_table(text)
    if table and len(table) > 1 and len(table[0]) > 1:
        normalized_tsv = "\n".join("\t".join(row) for row in table)
        return {
            "mode": "table",
            "normalized_text": normalized_tsv,
            "row_count": len(table),
            "column_count": max(len(row) for row in table),
            "single_cell_formula": _single_cell_formula(text),
            "notes": [
                "区切り表として解釈し、Excel Online に貼りやすい TSV へ正規化しました。",
                "原文を 1 セルに収めたい場合は single cell formula を使えます。",
            ],
        }
    normalized = text.strip().replace("\r\n", "\n")
    return {
        "mode": "single_cell" if single_cell or "\n" in normalized else "plain_text",
        "normalized_text": normalized if not single_cell else normalized.replace("\n", " / "),
        "row_count": 1,
        "column_count": 1,
        "single_cell_formula": _single_cell_formula(normalized),
        "notes": [
            "複数行テキストとして解釈しました。",
            "1 セルへ安全に入れたい場合の式候補も生成しました。",
        ],
    }


def _single_cell_formula(text: str) -> str:
    chunks = [chunk.replace('"', '""') for chunk in text.replace("\r\n", "\n").split("\n")]
    return "=" + "&CHAR(10)&".join(f'"{chunk}"' for chunk in chunks)


def synthesize_datasets(datasets: Iterable[str]) -> dict:
    parsed = [_parse_delimited_table(dataset) for dataset in datasets if dataset.strip()]
    parsed = [table for table in parsed if table]
    if not parsed:
        return {"headers": [], "rows": [], "notes": ["入力データがありません。"]}
    normalized_headers = []
    for table in parsed:
        normalized_headers.extend(table[0])
    merged_headers: list[str] = []
    for header in normalized_headers:
        if header not in merged_headers:
            merged_headers.append(header)
    merged_rows: list[dict[str, str]] = []
    for table in parsed:
        headers = table[0]
        for row in table[1:]:
            row_map = {header: "" for header in merged_headers}
            for index, header in enumerate(headers):
                row_map[header] = row[index] if index < len(row) else ""
            merged_rows.append(row_map)
    return {
        "headers": merged_headers,
        "rows": merged_rows,
        "notes": [
            "見出しを union でそろえ、新しい分析用テーブルとして統合しました。",
            "原本を壊さず Excel Online の新シートや新ブックへ貼り戻す前提です。",
        ],
    }


def suggest_chart(table_text: str) -> dict:
    table = _parse_delimited_table(table_text)
    if len(table) < 2:
        return {
            "chart_family": "none",
            "title": "表データが不足しています",
            "recommendations": ["ヘッダー行と少なくとも 1 行のデータを貼り付けてください。"],
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
        recs = ["数値列がないため、まず表として整形してください。"]
    elif len(numeric_indices) == 1:
        family = "bar"
        recs = [
            f"{headers[label_index]} を横軸、{headers[numeric_indices[0]]} を縦軸にした棒グラフが適します。",
            "カテゴリが時系列なら折れ線グラフへの切替も候補です。",
        ]
    else:
        family = "line"
        recs = [
            f"{headers[label_index]} を基準軸にして複数系列グラフを作れます。",
            "系列数が多すぎる場合は、最重要 2 列だけ残すと見やすくなります。",
        ]
    return {
        "chart_family": family,
        "title": "Graph Shadow Editor recommendation",
        "numeric_columns": [headers[index] for index in numeric_indices],
        "recommendations": recs,
    }


def interpret_intent(command: str, current_range: str | None = None) -> dict:
    normalized = command.strip().lower()
    action = "suggest"
    details = "自然言語を一般提案として扱います。"
    target_range = current_range
    if any(token in normalized for token in ["一番下", "last row", "bottom"]):
        action = "extend_down"
        details = "現在の range から下方向へ伸ばす候補を返します。"
    elif any(token in normalized for token in ["合計", "sum", "total"]):
        action = "sum"
        details = "数値列を合計する候補を返します。"
    elif any(token in normalized for token in ["グラフ", "chart", "bar", "line"]):
        action = "chart"
        details = "グラフ候補の確認を優先します。"
    elif any(token in normalized for token in ["貼り付け", "paste", "clean"]):
        action = "clean_paste"
        details = "貼り付け前の整形候補を優先します。"
    if current_range and action == "extend_down":
        suggestion = suggest_range(current_range)
        target_range = suggestion["smart_snap_range"]
    return {
        "action": action,
        "details": details,
        "target_range": target_range,
        "safety_note": "提案のみを返し、自動確定はしません。",
    }


def _is_number(value: str) -> bool:
    try:
        float(value.replace(",", ""))
        return True
    except ValueError:
        return False
