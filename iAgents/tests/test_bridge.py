import unittest

from iagents.bridge import BridgeStateStore


class BridgeStoreTest(unittest.TestCase):
    def test_update_and_snapshot(self) -> None:
        store = BridgeStateStore()
        result = store.update(
            {
                "source": "browser_bridge",
                "page_url": "https://example.com",
                "selection": "Sheet1!B3:D5",
                "mode": "selection",
                "table_preview": [["A", "B"], [1, 2]],
            }
        )
        self.assertEqual(result["source"], "browser_bridge")
        self.assertEqual(result["selection"], "Sheet1!B3:D5")
        self.assertEqual(result["table_preview"][0], ["A", "B"])


if __name__ == "__main__":
    unittest.main()
