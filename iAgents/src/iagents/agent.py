from __future__ import annotations

from dataclasses import dataclass

from .models import AgentSpec


ROLE_TEMPLATES = {
    "strategist": "目的を再定義し、進める順序を短く提案する",
    "critic": "曖昧さ、前提不足、失敗しやすい点を指摘する",
    "builder": "最小実装、確認方法、次アクションを具体化する",
}


@dataclass(slots=True)
class Agent:
    spec: AgentSpec

    def generate(self, brief: str, prior_summary: str, round_index: int) -> str:
        template = ROLE_TEMPLATES.get(self.spec.role, "担当視点から要点を整理する")
        context_hint = prior_summary if prior_summary else "初回 round のため brief を直接読む"
        return (
            f"[{self.spec.role}] {self.spec.name}: {template}。"
            f" focus は「{self.spec.focus}」。"
            f" round {round_index} では「{brief.splitlines()[0].strip('# ').strip()}」を扱う。"
            f" 共有文脈: {context_hint}。"
            f" tone は {self.spec.tone} で保つ。"
        )
