import unittest

from iagents.logic import (
    build_live_assist,
    clean_paste,
    interpret_intent,
    mode_halo_state,
    selection_time_machine,
    smart_snap_preview,
    suggest_chart,
    suggest_range,
    synthesize_datasets,
)


class LogicTest(unittest.TestCase):
    def test_suggest_range_expands_visible_area(self) -> None:
        result = suggest_range("Sheet1!B3:D5", visible_rows=10, visible_cols=4)
        self.assertEqual(result["current_range"], "Sheet1!B3:D5")
        self.assertEqual(result["smart_snap_range"], "Sheet1!B2:E12")
        self.assertEqual(result["focus_cell"], "Sheet1!C4")

    def test_selection_time_machine_keeps_latest_five(self) -> None:
        result = selection_time_machine(["A1", "B2", "C3", "D4", "E5"], "F6")
        self.assertEqual(result["history"], ["F6", "A1", "B2", "C3", "D4"])
        self.assertEqual(result["restore_offer"], "A1")

    def test_smart_snap_preview_returns_ghost_range(self) -> None:
        result = smart_snap_preview("Sheet1!B3:D5", occupied_rows=10, occupied_cols=5)
        self.assertEqual(result["ghost_range"], "Sheet1!B2:F12")
        self.assertGreater(result["confidence"], 0.5)

    def test_clean_paste_normalizes_markdown_table(self) -> None:
        text = "| Month | Sales |\n|---|---|\n| Jan | 120 |\n| Feb | 140 |"
        result = clean_paste(text)
        self.assertEqual(result["mode"], "table")
        self.assertIn("Month\tSales", result["normalized_text"])
        self.assertIn("CHAR(10)", result["single_cell_formula"])

    def test_synthesize_datasets_uses_header_union(self) -> None:
        result = synthesize_datasets(
            [
                "Month,Sales\nJan,120",
                "月,Profit\nJan,30",
            ]
        )
        self.assertEqual(result["headers"], ["Month", "Sales", "Profit"])
        self.assertEqual(len(result["rows"]), 2)

    def test_chart_suggestion_detects_bar_chart(self) -> None:
        result = suggest_chart("Month,Sales\nJan,120\nFeb,180")
        self.assertEqual(result["chart_family"], "bar")
        self.assertIn("clustered bar", result["variants"])

    def test_halo_state_returns_mode_and_ime(self) -> None:
        result = mode_halo_state("formula", "full")
        self.assertEqual(result["mode"], "数式")
        self.assertEqual(result["ime_state"], "全角")

    def test_intent_interpretation_prefers_sum(self) -> None:
        result = interpret_intent("売上を合計", "Sheet1!B3:B10")
        self.assertEqual(result["action"], "sum")
        self.assertEqual(result["target_range"], "Sheet1!B3:B10")

    def test_live_assist_uses_bridge_selection(self) -> None:
        result = build_live_assist({"selection": "Sheet1!B3:D5", "mode": "formula", "ime_state": "full"})
        self.assertEqual(result["status"], "ready")
        self.assertEqual(result["range_assist"]["smart_snap_range"], "Sheet1!B2:I22")
        self.assertEqual(result["halo"]["mode"], "数式")


if __name__ == "__main__":
    unittest.main()
