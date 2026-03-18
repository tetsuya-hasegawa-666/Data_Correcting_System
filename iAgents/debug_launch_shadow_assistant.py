from __future__ import annotations

import sys
import traceback
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"

if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))


def main() -> int:
    print("== iAgents Debug Launcher ==")
    print(f"ROOT={ROOT}")
    print(f"SRC={SRC}")
    print(f"PYTHON={sys.executable}")
    print(f"VERSION={sys.version}")
    try:
        from iagents.desktop_app import run_desktop_app

        print("Import desktop_app: OK")
        print("Launching desktop app...")
        run_desktop_app()
        return 0
    except Exception as exc:  # noqa: BLE001
        print("Launch failed.")
        print(f"ERROR={type(exc).__name__}: {exc}")
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
