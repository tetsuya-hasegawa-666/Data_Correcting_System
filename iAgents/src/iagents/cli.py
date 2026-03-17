from __future__ import annotations

import argparse
from pathlib import Path

from .orchestrator import Orchestrator, load_team_config


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run the iAgents collaboration demo.")
    parser.add_argument(
        "--brief-file",
        type=Path,
        default=Path("data/seed/session/brief.md"),
        help="Path to the brief markdown file.",
    )
    parser.add_argument(
        "--team-config",
        type=Path,
        default=Path("data/seed/config/agent_team.sample.json"),
        help="Path to the team config JSON file.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional markdown output path.",
    )
    return parser


def render_markdown(result) -> str:
    lines = ["# iAgents Session Report", "", "## Brief", "", result.brief.strip(), ""]
    current_round = None
    for turn in result.turns:
        if turn.round_index != current_round:
            current_round = turn.round_index
            lines.extend([f"## Round {current_round}", ""])
        lines.extend([f"### {turn.agent_name} ({turn.role})", "", turn.content, ""])
    lines.extend(["## Final synthesis", "", result.synthesis, ""])
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    brief = args.brief_file.read_text(encoding="utf-8")
    rounds, specs = load_team_config(args.team_config)
    orchestrator = Orchestrator(specs=specs, rounds=rounds)
    result = orchestrator.run(brief)
    report = render_markdown(result)

    if args.output is not None:
        args.output.write_text(report, encoding="utf-8")

    print(report)
    return 0
