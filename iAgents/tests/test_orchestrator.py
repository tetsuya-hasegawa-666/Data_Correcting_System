from pathlib import Path
import unittest

from iagents.orchestrator import Orchestrator, load_team_config


ROOT = Path(__file__).resolve().parents[1]


class OrchestratorTest(unittest.TestCase):
    def test_run_builds_turns_and_synthesis(self) -> None:
        rounds, specs = load_team_config(ROOT / "data/seed/config/agent_team.sample.json")
        brief = (ROOT / "data/seed/session/brief.md").read_text(encoding="utf-8")

        result = Orchestrator(specs=specs, rounds=rounds).run(brief)

        self.assertEqual(len(result.turns), rounds * len(specs))
        self.assertIn("Final synthesis", result.synthesis)
        self.assertTrue(any(turn.role == "critic" for turn in result.turns))


if __name__ == "__main__":
    unittest.main()
