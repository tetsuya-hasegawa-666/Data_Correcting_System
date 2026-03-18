from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class HostEndpoint:
    primary: str
    optional_remote: str
    current_mode: str


def resolve_host_endpoint() -> HostEndpoint:
    primary = os.environ.get("ICLONE_PRIMARY_HOST", "http://pc-name.local")
    tailscale_host = os.environ.get("ICLONE_TAILSCALE_HOST", "http://tezy-gt37-tail")
    use_tailscale = os.environ.get("ICLONE_USE_TAILSCALE", "0") == "1"
    mode = "tailscale" if use_tailscale else "mdns"
    return HostEndpoint(
        primary=primary,
        optional_remote=tailscale_host,
        current_mode=mode,
    )


if __name__ == "__main__":
    endpoint = resolve_host_endpoint()
    print(f"mode={endpoint.current_mode}")
    print(f"primary={endpoint.primary}")
    print(f"optional_remote={endpoint.optional_remote}")

