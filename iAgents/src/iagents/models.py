from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass(slots=True)
class AgentSpec:
    name: str
    role: str
    tone: str
    focus: str


@dataclass(slots=True)
class AgentTurn:
    round_index: int
    agent_name: str
    role: str
    content: str


@dataclass(slots=True)
class SessionResult:
    brief: str
    turns: List[AgentTurn] = field(default_factory=list)
    synthesis: str = ""
