from __future__ import annotations

from pathlib import Path
from typing import Any


def _parse_scalar(value: str) -> Any:
    stripped = value.strip()
    if stripped.startswith('"') and stripped.endswith('"'):
        return stripped[1:-1]
    if stripped.startswith("'") and stripped.endswith("'"):
        return stripped[1:-1]
    lowered = stripped.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    if lowered in {"null", "none"}:
        return None
    try:
        if stripped.startswith("0") and stripped != "0" and not stripped.startswith("0."):
            raise ValueError
        return int(stripped)
    except ValueError:
        pass
    try:
        return float(stripped)
    except ValueError:
        return stripped


def _split_key_value(text: str) -> tuple[str, str | None]:
    if ":" not in text:
        return text.strip(), None
    key, value = text.split(":", 1)
    value = value.strip()
    return key.strip(), value if value else None


def parse_yaml_text(text: str) -> Any:
    lines = text.splitlines()
    root: Any = {}
    stack: list[tuple[int, Any]] = [(-1, root)]

    for index, raw_line in enumerate(lines):
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue

        indent = len(raw_line) - len(raw_line.lstrip(" "))
        stripped = raw_line.strip()

        while len(stack) > 1 and indent <= stack[-1][0]:
            stack.pop()

        parent = stack[-1][1]

        if stripped.startswith("- "):
            item_text = stripped[2:].strip()
            if not isinstance(parent, list):
                raise ValueError(f"unexpected list item: {raw_line}")

            if ":" in item_text:
                key, value = _split_key_value(item_text)
                item: dict[str, Any] = {}
                if value is None:
                    item[key] = {}
                    parent.append(item)
                    stack.append((indent, item))
                    stack.append((indent + 2, item[key]))
                else:
                    item[key] = _parse_scalar(value)
                    parent.append(item)
                    stack.append((indent, item))
            else:
                parent.append(_parse_scalar(item_text))
            continue

        key, value = _split_key_value(stripped)
        if isinstance(parent, list):
            raise ValueError(f"unexpected mapping under list: {raw_line}")

        next_container: Any
        if value is None:
            next_nonempty = None
            for candidate in lines[index + 1 :]:
                if candidate.strip() and not candidate.lstrip().startswith("#"):
                    next_nonempty = candidate.strip()
                    break
            next_container = [] if next_nonempty and next_nonempty.startswith("- ") else {}
            parent[key] = next_container
            stack.append((indent, next_container))
        else:
            parent[key] = _parse_scalar(value)

    return root


def load_yaml(path: Path) -> Any:
    return parse_yaml_text(path.read_text(encoding="utf-8"))


def _format_scalar(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    escaped = str(value).replace('"', '\\"')
    return f'"{escaped}"'


def dump_yaml(data: Any, indent: int = 0) -> str:
    lines: list[str] = []
    prefix = " " * indent

    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                lines.append(f"{prefix}{key}:")
                lines.append(dump_yaml(value, indent + 2))
            else:
                lines.append(f"{prefix}{key}: {_format_scalar(value)}")
        return "\n".join(lines)

    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                first = True
                for key, value in item.items():
                    if first and not isinstance(value, (dict, list)):
                        lines.append(f"{prefix}- {key}: {_format_scalar(value)}")
                        first = False
                    elif first:
                        lines.append(f"{prefix}- {key}:")
                        lines.append(dump_yaml(value, indent + 4))
                        first = False
                    elif isinstance(value, (dict, list)):
                        lines.append(f"{prefix}  {key}:")
                        lines.append(dump_yaml(value, indent + 4))
                    else:
                        lines.append(f"{prefix}  {key}: {_format_scalar(value)}")
                if not item:
                    lines.append(f"{prefix}- {{}}")
            elif isinstance(item, list):
                lines.append(f"{prefix}-")
                lines.append(dump_yaml(item, indent + 2))
            else:
                lines.append(f"{prefix}- {_format_scalar(item)}")
        return "\n".join(lines)

    return f"{prefix}{_format_scalar(data)}"


def write_yaml(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dump_yaml(data) + "\n", encoding="utf-8")
