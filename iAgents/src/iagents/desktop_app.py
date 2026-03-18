from __future__ import annotations

import tkinter as tk
from tkinter import messagebox, ttk
import urllib.request
import webbrowser

from .server import ServerController
from .windows_detect import detect_excel_online_window


EXCEL_ONLINE_URL = "https://www.office.com/launch/excel"


class DesktopApp:
    def __init__(self, host: str = "127.0.0.1", port: int = 8765) -> None:
        self.server = ServerController(host=host, port=port)
        self.root = tk.Tk()
        self.root.title("iAgents Shadow Assistant")
        self.root.geometry("620x640")
        self.root.minsize(580, 560)

        self.status_var = tk.StringVar(value="Stopped")
        self.detected_title_var = tk.StringVar(value="未検知")
        self.auto_launch_var = tk.BooleanVar(value=True)
        self.health_var = tk.StringVar(value="未確認")
        self.next_step_var = tk.StringVar(value="1. Excel Online を開く")
        self.shadow_opened = False

        self._build_ui()
        self.root.protocol("WM_DELETE_WINDOW", self._on_close)
        self._ensure_server()
        self._bring_to_front()
        self._poll_excel_window()

    def _build_ui(self) -> None:
        frame = ttk.Frame(self.root, padding=18)
        frame.pack(fill="both", expand=True)

        title = ttk.Label(frame, text="Excel Online Shadow Assistant", font=("Segoe UI", 18, "bold"))
        title.pack(anchor="w")

        summary = ttk.Label(
            frame,
            text="Excel Online を開いたら companion app を横で使うための Windows launcher です。",
            wraplength=500,
        )
        summary.pack(anchor="w", pady=(8, 18))

        status_box = ttk.LabelFrame(frame, text="Status", padding=14)
        status_box.pack(fill="x")
        ttk.Label(status_box, text="Server").grid(row=0, column=0, sticky="w")
        ttk.Label(status_box, textvariable=self.status_var).grid(row=0, column=1, sticky="w", padx=(10, 0))
        ttk.Label(status_box, text="Excel Online").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Label(status_box, textvariable=self.detected_title_var, wraplength=360).grid(
            row=1, column=1, sticky="w", padx=(10, 0), pady=(8, 0)
        )
        ttk.Label(status_box, text="Health").grid(row=2, column=0, sticky="w", pady=(8, 0))
        ttk.Label(status_box, textvariable=self.health_var).grid(row=2, column=1, sticky="w", padx=(10, 0), pady=(8, 0))

        action_box = ttk.LabelFrame(frame, text="Actions", padding=14)
        action_box.pack(fill="x", pady=(16, 0))
        ttk.Button(action_box, text="Shadow Assistant を開く", command=self.open_shadow_assistant).pack(fill="x")
        ttk.Button(action_box, text="Excel Online を開く", command=self.open_excel_online).pack(fill="x", pady=(10, 0))
        ttk.Button(action_box, text="セットアップ確認", command=self.check_setup).pack(fill="x", pady=(10, 0))
        ttk.Button(action_box, text="Server 再起動", command=self.restart_server).pack(fill="x", pady=(10, 0))
        ttk.Checkbutton(
            action_box,
            text="Excel Online を検知したら companion を自動で開く",
            variable=self.auto_launch_var,
        ).pack(anchor="w", pady=(12, 0))

        quick_box = ttk.LabelFrame(frame, text="今やること", padding=14)
        quick_box.pack(fill="x", pady=(16, 0))
        ttk.Label(quick_box, textvariable=self.next_step_var, wraplength=540, justify="left").pack(anchor="w")

        notes_box = ttk.LabelFrame(frame, text="How It Works", padding=14)
        notes_box.pack(fill="both", expand=True, pady=(16, 0))
        notes = (
            "1. この launcher が local server を起動します。\n"
            "2. Excel Online を browser で開きます。\n"
            "3. window title に Excel を含む browser を検知すると、必要なら companion を自動で開きます。\n"
            "4. range や表データは assistant 側へ手渡して使います。\n"
            "5. セットアップ確認を押すと、server health と次の手順を案内します。"
        )
        ttk.Label(notes_box, text=notes, wraplength=500, justify="left").pack(anchor="w")

    def _ensure_server(self) -> None:
        url = self.server.start()
        self.status_var.set(f"Running at {url}")

    def restart_server(self) -> None:
        self.server.stop()
        self.shadow_opened = False
        self.health_var.set("未確認")
        self._ensure_server()

    def open_shadow_assistant(self) -> None:
        if not self.server.is_running:
            self._ensure_server()
        webbrowser.open(self.server.url)
        self.shadow_opened = True
        self.next_step_var.set("2. Excel Online 側の名前ボックス range を assistant へ入力")

    def open_excel_online(self) -> None:
        webbrowser.open(EXCEL_ONLINE_URL)
        self.next_step_var.set("1. Excel Online にサインインしてブックを開く")

    def check_setup(self) -> None:
        try:
            with urllib.request.urlopen(self.server.url + "api/health", timeout=5) as response:
                payload = response.read().decode("utf-8")
            self.health_var.set("正常")
            detected = self.detected_title_var.get()
            if detected == "未検知":
                self.next_step_var.set("1. Excel Online を開く。2. 自動で開かなければ『Shadow Assistant を開く』を押す")
            else:
                self.next_step_var.set("次は range を assistant に入れて『提案する』を押す")
            messagebox.showinfo("セットアップ確認", "Shadow Assistant は起動しています。\n\n" + payload)
        except Exception as exc:  # noqa: BLE001
            self.health_var.set("異常")
            messagebox.showerror("セットアップ確認", f"local server へ接続できませんでした。\n\n{exc}")

    def _poll_excel_window(self) -> None:
        title = detect_excel_online_window()
        self.detected_title_var.set(title or "未検知")
        if title and self.auto_launch_var.get() and not self.shadow_opened:
            self.open_shadow_assistant()
        if title and self.shadow_opened:
            self.next_step_var.set("Excel Online を検知済みです。名前ボックス range を assistant に貼り付けてください")
        self.root.after(3000, self._poll_excel_window)

    def _bring_to_front(self) -> None:
        self.root.update_idletasks()
        self.root.deiconify()
        self.root.lift()
        self.root.attributes("-topmost", True)
        self.root.after(1200, lambda: self.root.attributes("-topmost", False))
        try:
            self.root.focus_force()
        except Exception:  # noqa: BLE001
            pass

    def _on_close(self) -> None:
        self.server.stop()
        self.root.destroy()

    def run(self) -> None:
        self.root.mainloop()


def run_desktop_app(host: str = "127.0.0.1", port: int = 8765) -> None:
    app = DesktopApp(host=host, port=port)
    app.run()
