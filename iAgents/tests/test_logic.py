import unittest

from iagents.logic import clean_paste, interpret_intent, suggest_chart, suggest_range, synthesize_datasets


class LogicTest(unittest.TestCase):
    def test_suggest_range_expands_visible_area(self) -> None:
        result = suggest_range("Sheet1!B3:D5", visible_rows=10, visible_cols=4)
        self.assertEqual(result["current_range"], "Sheet1!B3:D5")
        self.assertEqual(result["smart_snap_range"], "Sheet1!B2:E12")

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
                "Month,Profit\nJan,30",
            ]
        )
        self.assertEqual(result["headers"], ["Month", "Sales", "Profit"])
        self.assertEqual(len(result["rows"]), 2)

    def test_chart_suggestion_detects_bar_chart(self) -> None:
        result = suggest_chart("Month,Sales\nJan,120\nFeb,180")
        self.assertEqual(result["chart_family"], "bar")

    def test_intent_interpretation_prefers_sum(self) -> None:
        result = interpret_intent("売上を合計", "Sheet1!B3:B10")
        self.assertEqual(result["action"], "sum")
        self.assertEqual(result["target_range"], "Sheet1!B3:B10")


if __name__ == "__main__":
    unittest.main()
