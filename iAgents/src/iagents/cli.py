from __future__ import annotations

import argparse
import json

from .desktop_app import run_desktop_app
from .logic import clean_paste, interpret_intent, suggest_chart, suggest_range, synthesize_datasets
from .server import serve


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run the iAgents Excel Online shadow assistant.")
    subparsers = parser.add_subparsers(dest="command")

    app_parser = subparsers.add_parser("app", help="Run the Windows desktop launcher.")
    app_parser.add_argument("--host", default="127.0.0.1")
    app_parser.add_argument("--port", type=int, default=8765)

    serve_parser = subparsers.add_parser("serve", help="Run the local shadow assistant web app.")
    serve_parser.add_argument("--host", default="127.0.0.1")
    serve_parser.add_argument("--port", type=int, default=8765)
    serve_parser.add_argument("--open-browser", action="store_true")

    range_parser = subparsers.add_parser("range", help="Suggest a Smart Snap range.")
    range_parser.add_argument("range_text")
    range_parser.add_argument("--visible-rows", type=int, default=20)
    range_parser.add_argument("--visible-cols", type=int, default=8)

    paste_parser = subparsers.add_parser("paste", help="Normalize pasted content.")
    paste_parser.add_argument("text")
    paste_parser.add_argument("--single-cell", action="store_true")

    synth_parser = subparsers.add_parser("synthesize", help="Merge two delimited datasets.")
    synth_parser.add_argument("dataset_a")
    synth_parser.add_argument("dataset_b")

    chart_parser = subparsers.add_parser("chart", help="Suggest a chart family from table text.")
    chart_parser.add_argument("table_text")

    intent_parser = subparsers.add_parser("intent", help="Interpret a natural-language Excel instruction.")
    intent_parser.add_argument("command_text")
    intent_parser.add_argument("--current-range", default=None)

    args = parser.parse_args(argv)
    if args.command in {None, "app"}:
        run_desktop_app(
            host=args.host if args.command else "127.0.0.1",
            port=args.port if args.command else 8765,
        )
        return 0
    if args.command == "serve":
        serve(
            host=args.host,
            port=args.port,
            open_browser=bool(args.open_browser),
        )
        return 0
    if args.command == "range":
        print(json.dumps(suggest_range(args.range_text, args.visible_rows, args.visible_cols), ensure_ascii=False, indent=2))
        return 0
    if args.command == "paste":
        print(json.dumps(clean_paste(args.text, args.single_cell), ensure_ascii=False, indent=2))
        return 0
    if args.command == "synthesize":
        print(json.dumps(synthesize_datasets([args.dataset_a, args.dataset_b]), ensure_ascii=False, indent=2))
        return 0
    if args.command == "chart":
        print(json.dumps(suggest_chart(args.table_text), ensure_ascii=False, indent=2))
        return 0
    if args.command == "intent":
        print(json.dumps(interpret_intent(args.command_text, args.current_range), ensure_ascii=False, indent=2))
        return 0
    return 0
