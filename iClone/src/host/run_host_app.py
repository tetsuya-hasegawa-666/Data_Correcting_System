from __future__ import annotations

import mimetypes
import os
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PREVIEW_ROOT = ROOT / "preview"
RUNTIME_LOGS = ROOT / "runtime" / "logs"


def resolve_port(default: int = 8874) -> int:
    return int(os.environ.get("ICLONE_HOST_APP_PORT", str(default)))


class HostPreviewHandler(BaseHTTPRequestHandler):
    def do_HEAD(self) -> None:  # noqa: N802
        self._serve_request(head_only=True)

    def do_GET(self) -> None:  # noqa: N802
        self._serve_request(head_only=False)

    def _serve_request(self, head_only: bool) -> None:
        path_map = {
            "/": PREVIEW_ROOT / "index.html",
            "/preview/index.html": PREVIEW_ROOT / "index.html",
            "/preview/app.js": PREVIEW_ROOT / "app.js",
            "/preview/styles.css": PREVIEW_ROOT / "styles.css",
            "/runtime/logs/status_snapshot.js": RUNTIME_LOGS / "status_snapshot.js",
            "/runtime/logs/review_snapshot.js": RUNTIME_LOGS / "review_snapshot.js",
            "/api/health": None,
        }

        if self.path.startswith("/runtime/"):
            relative = self.path.lstrip("/")
            target = ROOT / relative
            if target.exists() and target.is_file():
                data = target.read_bytes()
                self.send_response(HTTPStatus.OK)
                self.send_header(
                    "Content-Type",
                    mimetypes.guess_type(target.name)[0] or "application/octet-stream",
                )
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                if not head_only:
                    self.wfile.write(data)
                return

        target = path_map.get(self.path)
        if self.path == "/api/health":
            payload = b'{"status":"ok","app":"iClone Host App"}'
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            if not head_only:
                self.wfile.write(payload)
            return

        if target is None or not target.exists():
            self.send_error(HTTPStatus.NOT_FOUND, "Not Found")
            return

        data = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header(
            "Content-Type",
            mimetypes.guess_type(target.name)[0] or "application/octet-stream",
        )
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if not head_only:
            self.wfile.write(data)

    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> None:
    port = resolve_port()
    url = f"http://127.0.0.1:{port}/preview/index.html"
    try:
        server = ThreadingHTTPServer(("127.0.0.1", port), HostPreviewHandler)
    except OSError:
        webbrowser.open(url)
        print(url)
        return

    print(url)
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
