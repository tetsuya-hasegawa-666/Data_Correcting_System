from __future__ import annotations

import ctypes
from ctypes import wintypes


user32 = ctypes.windll.user32
WNDENUMPROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)


def list_visible_window_titles() -> list[str]:
    titles: list[str] = []

    enum_windows = user32.EnumWindows
    enum_windows.argtypes = [WNDENUMPROC, wintypes.LPARAM]
    enum_windows.restype = wintypes.BOOL

    is_visible = user32.IsWindowVisible
    is_visible.argtypes = [wintypes.HWND]
    is_visible.restype = wintypes.BOOL

    get_length = user32.GetWindowTextLengthW
    get_length.argtypes = [wintypes.HWND]
    get_length.restype = ctypes.c_int

    get_text = user32.GetWindowTextW
    get_text.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
    get_text.restype = ctypes.c_int

    @WNDENUMPROC
    def callback(hwnd: int, lparam: int) -> bool:
        if not is_visible(hwnd):
            return True
        length = get_length(hwnd)
        if length == 0:
            return True
        buffer = ctypes.create_unicode_buffer(length + 1)
        get_text(hwnd, buffer, length + 1)
        title = buffer.value.strip()
        if title:
            titles.append(title)
        return True

    enum_windows(callback, 0)
    return titles


def detect_excel_online_window() -> str | None:
    keywords = ("excel", "microsoft excel")
    for title in list_visible_window_titles():
        lowered = title.lower()
        if any(keyword in lowered for keyword in keywords):
            return title
    return None
