from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, List

from .agent import Agent
from .models import AgentSpec, AgentTurn, SessionResult


def load_team_config(path: Path) -> tuple[int, List[AgentSpec]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    rounds = int(payload.get("rounds", 2))
    agents = [
        AgentSpec(
            name=item["name"],
            role=item["role"],
            tone=item.get("tone", "neutral"),
            focus=item.get("focus", "要点整理"),
        )
        for item in payload["agents"]
    ]
    return rounds, agents


def summarize_turns(turns: Iterable[AgentTurn]) -> str:
    snippets = [f"{turn.agent_name}:{turn.role}" for turn in turns]
    return " / ".join(snippets[-3:]) if snippets else "共有文脈なし"


class Orchestrator:
    def __init__(self, specs: List[AgentSpec], rounds: int) -> None:
        self._agents = [Agent(spec) for spec in specs]
        self._rounds = rounds

    def run(self, brief: str) -> SessionResult:
        result = SessionResult(brief=brief)
        for round_index in range(1, self._rounds + 1):
            prior_summary = summarize_turns(result.turns)
            for agent in self._agents:
                content = agent.generate(brief=brief, prior_summary=prior_summary, round_index=round_index)
                result.turns.append(
                    AgentTurn(
                        round_index=round_index,
                        agent_name=agent.spec.name,
                        role=agent.spec.role,
                        content=content,
                    )
                )
        result.synthesis = self._synthesize(result)
        return result

    def _synthesize(self, result: SessionResult) -> str:
        roles = ", ".join(sorted({turn.role for turn in result.turns}))
        return (
            "Final synthesis: "
            f"この session では {roles} の観点を使って brief を整理した。"
            " 次は provider adapter を分離し、同じ flow を実モデルでも再現できるか確認する。"
        )
