from __future__ import annotations

import json
import mimetypes
import threading
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable

from .bridge import BridgeStateStore
from .logic import (
    clean_paste,
    build_live_assist,
    interpret_intent,
    mode_halo_state,
    selection_time_machine,
    smart_snap_preview,
    suggest_chart,
    suggest_range,
    synthesize_datasets,
)


WEB_ROOT = Path(__file__).with_name("web")
BRIDGE_STORE = BridgeStateStore()


class ShadowAssistantHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        if self.path in {"/", "/index.html"}:
            self._serve_file("index.html", "text/html; charset=utf-8")
            return
        if self.path == "/app.js":
            self._serve_file("app.js", "application/javascript; charset=utf-8")
            return
        if self.path == "/styles.css":
            self._serve_file("styles.css", "text/css; charset=utf-8")
            return
        if self.path == "/api/health":
            self._send_json({"status": "ok", "app": "iAgents Excel Online Shadow Assistant"})
            return
        if self.path == "/api/bridge/state":
            self._send_json(BRIDGE_STORE.snapshot())
            return
        if self.path == "/api/bridge/assist":
            self._send_json(build_live_assist(BRIDGE_STORE.snapshot()))
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def do_POST(self) -> None:  # noqa: N802
        routes: dict[str, Callable[[dict[str, Any]], dict[str, Any]]] = {
            "/api/range/suggest": self._handle_range_suggest,
            "/api/history/record": self._handle_history_record,
            "/api/snap/preview": self._handle_snap_preview,
            "/api/paste/clean": self._handle_paste_clean,
            "/api/data/synthesize": self._handle_data_synthesize,
            "/api/graph/suggest": self._handle_graph_suggest,
            "/api/intent/interpret": self._handle_intent_interpret,
            "/api/halo/state": self._handle_halo_state,
            "/api/bridge/state": self._handle_bridge_state,
            "/api/bridge/assist": self._handle_bridge_assist,
        }
        handler = routes.get(self.path)
        if handler is None:
            self.send_error(HTTPStatus.NOT_FOUND, "Not Found")
            return
        payload = self._read_json()
        self._send_json(handler(payload))

    def log_message(self, format: str, *args: object) -> None:
        return

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length) if length else b"{}"
        return json.loads(body.decode("utf-8"))

    def _send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def _serve_file(self, name: str, content_type: str | None = None) -> None:
        path = WEB_ROOT / name
        if not path.exists():
            self.send_error(HTTPStatus.NOT_FOUND, "Not Found")
            return
        payload = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header(
            "Content-Type",
            content_type or mimetypes.guess_type(name)[0] or "application/octet-stream",
        )
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _handle_range_suggest(self, payload: dict[str, Any]) -> dict[str, Any]:
        return suggest_range(
            payload["range_text"],
            visible_rows=int(payload.get("visible_rows", 20)),
            visible_cols=int(payload.get("visible_cols", 8)),
        )

    def _handle_history_record(self, payload: dict[str, Any]) -> dict[str, Any]:
        return selection_time_machine(payload.get("history", []), payload.get("new_range", ""))

    def _handle_snap_preview(self, payload: dict[str, Any]) -> dict[str, Any]:
        return smart_snap_preview(
            payload.get("range_text", ""),
            occupied_rows=int(payload.get("occupied_rows", 20)),
            occupied_cols=int(payload.get("occupied_cols", 8)),
        )

    def _handle_paste_clean(self, payload: dict[str, Any]) -> dict[str, Any]:
        return clean_paste(payload.get("text", ""), single_cell=bool(payload.get("single_cell", False)))

    def _handle_data_synthesize(self, payload: dict[str, Any]) -> dict[str, Any]:
        return synthesize_datasets(payload.get("datasets", []))

    def _handle_graph_suggest(self, payload: dict[str, Any]) -> dict[str, Any]:
        return suggest_chart(payload.get("table_text", ""))

    def _handle_intent_interpret(self, payload: dict[str, Any]) -> dict[str, Any]:
        return interpret_intent(payload.get("command", ""), payload.get("current_range"))

    def _handle_halo_state(self, payload: dict[str, Any]) -> dict[str, Any]:
        return mode_halo_state(payload.get("mode", ""), payload.get("ime_state", "auto"))

    def _handle_bridge_state(self, payload: dict[str, Any]) -> dict[str, Any]:
        return BRIDGE_STORE.update(payload)

    def _handle_bridge_assist(self, payload: dict[str, Any]) -> dict[str, Any]:
        if payload:
            state = BRIDGE_STORE.update(payload)
        else:
            state = BRIDGE_STORE.snapshot()
        return build_live_assist(state)


class ServerController:
    def __init__(self, host: str = "127.0.0.1", port: int = 8765) -> None:
        self.host = host
        self.port = port
        self.url = f"http://{host}:{port}/"
        self._server: ThreadingHTTPServer | None = None
        self._thread: threading.Thread | None = None

    def start(self) -> str:
        if self._server is not None:
            return self.url
        self._server = ThreadingHTTPServer((self.host, self.port), ShadowAssistantHandler)
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()
        return self.url

    def stop(self) -> None:
        if self._server is None:
            return
        self._server.shutdown()
        self._server.server_close()
        if self._thread is not None:
            self._thread.join(timeout=2)
        self._server = None
        self._thread = None

    @property
    def is_running(self) -> bool:
        return self._server is not None


def serve(host: str = "127.0.0.1", port: int = 8765, open_browser: bool = False) -> None:
    controller = ServerController(host=host, port=port)
    url = controller.start()
    print(f"iAgents Excel Online Shadow Assistant running at {url}")
    print("Open Excel Online in your browser and keep this app side-by-side.")
    if open_browser:
        webbrowser.open(url)
    try:
        while True:
            threading.Event().wait(1)
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        controller.stop()
