from __future__ import annotations

from dataclasses import dataclass, field
from threading import Lock
from time import time
from typing import Any


@dataclass(slots=True)
class BridgeState:
    source: str = "none"
    page_url: str = ""
    page_title: str = ""
    workbook_name: str = ""
    worksheet_name: str = ""
    selection: str = ""
    mode: str = ""
    ime_state: str = "auto"
    table_preview: list[list[str]] = field(default_factory=list)
    selection_history: list[str] = field(default_factory=list)
    updated_at: float = 0.0


class BridgeStateStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._state = BridgeState()

    def update(self, payload: dict[str, Any]) -> dict[str, Any]:
        with self._lock:
            selection = str(payload.get("selection", ""))
            self._state = BridgeState(
                source=str(payload.get("source", "bridge")),
                page_url=str(payload.get("page_url", "")),
                page_title=str(payload.get("page_title", "")),
                workbook_name=str(payload.get("workbook_name", "")),
                worksheet_name=str(payload.get("worksheet_name", "")),
                selection=selection,
                mode=str(payload.get("mode", "")),
                ime_state=str(payload.get("ime_state", "auto")),
                table_preview=_normalize_table_preview(payload.get("table_preview", [])),
                selection_history=self._selection_history_for(selection),
                updated_at=time(),
            )
            return self._snapshot_unlocked()

    def snapshot(self) -> dict[str, Any]:
        with self._lock:
            return self._snapshot_unlocked()

    def _selection_history_for(self, selection: str) -> list[str]:
        normalized = selection.strip()
        current = list(self._state.selection_history)
        if not normalized:
            return current[:5]
        return [normalized, *[item for item in current if item != normalized]][:5]

    def _snapshot_unlocked(self) -> dict[str, Any]:
        return {
            "source": self._state.source,
            "page_url": self._state.page_url,
            "page_title": self._state.page_title,
            "workbook_name": self._state.workbook_name,
            "worksheet_name": self._state.worksheet_name,
            "selection": self._state.selection,
            "mode": self._state.mode,
            "ime_state": self._state.ime_state,
            "table_preview": self._state.table_preview,
            "selection_history": self._state.selection_history,
            "updated_at": self._state.updated_at,
        }


def _normalize_table_preview(value: Any) -> list[list[str]]:
    if not isinstance(value, list):
        return []
    rows: list[list[str]] = []
    for row in value[:10]:
        if isinstance(row, list):
            rows.append([str(cell) for cell in row[:8]])
    return rows
