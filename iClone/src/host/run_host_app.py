from __future__ import annotations

import json
import mimetypes
import os
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from workspace_api import (
    ROOT,
    build_bootstrap_payload,
    create_host_entry,
    empty_trash,
    delete_record,
    ensure_directories,
    move_record_to_trash,
    queue_record_for_device,
    save_host_settings,
)


PREVIEW_ROOT = ROOT / "preview"
RUNTIME_LOGS = ROOT / "runtime" / "logs"


def resolve_port(default: int = 8874) -> int:
    return int(os.environ.get("ICLONE_HOST_APP_PORT", str(default)))


class HostPreviewHandler(BaseHTTPRequestHandler):
    def do_HEAD(self) -> None:  # noqa: N802
        self._serve_static(head_only=True)

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith("/api/workspace/bootstrap"):
            self._write_json(build_bootstrap_payload())
            return
        if self.path == "/api/health":
            self._write_json({"status": "ok", "app": "iClone Host App"})
            return
        self._serve_static(head_only=False)

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/api/workspace/entries":
            payload = self._read_json_body()
            result = create_host_entry(payload, sync_now=bool(payload.get("syncNow", True)))
            self._write_json(result, status=HTTPStatus.CREATED)
            return
        if self.path == "/api/workspace/trash/empty":
            self._write_json(empty_trash(propagate=True))
            return
        if self.path == "/api/workspace/settings":
            payload = self._read_json_body()
            self._write_json(save_host_settings(payload))
            return
        if self.path == "/api/workspace/sync-now":
            payload = self._read_json_body()
            self._write_json(queue_record_for_device(str(payload.get("entryId", ""))))
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def do_DELETE(self) -> None:  # noqa: N802
        if self.path.startswith("/api/workspace/entries/"):
            entry_id = self.path.rsplit("/", 1)[-1]
            self._write_json(move_record_to_trash(entry_id))
            return
        if self.path.startswith("/api/workspace/trash/"):
            entry_id = self.path.rsplit("/", 1)[-1]
            self._write_json(delete_record(entry_id, propagate=True))
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def _read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        data = self.rfile.read(length)
        if not data:
            return {}
        return json.loads(data.decode("utf-8"))

    def _write_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _serve_static(self, head_only: bool) -> None:
        path_map = {
            "/": PREVIEW_ROOT / "index.html",
            "/preview/index.html": PREVIEW_ROOT / "index.html",
            "/preview/app.js": PREVIEW_ROOT / "app.js",
            "/preview/styles.css": PREVIEW_ROOT / "styles.css",
            "/runtime/logs/status_snapshot.js": RUNTIME_LOGS / "status_snapshot.js",
            "/runtime/logs/review_snapshot.js": RUNTIME_LOGS / "review_snapshot.js",
        }

        parsed = urlparse(self.path)
        request_path = parsed.path
        if request_path.startswith("/runtime/"):
            relative = request_path.lstrip("/")
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

        target = path_map.get(request_path)
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
    ensure_directories()
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
