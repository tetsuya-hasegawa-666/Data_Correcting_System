$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$env:ICLONE_PRIMARY_HOST = "http://pc-name.local"
$env:ICLONE_TAILSCALE_HOST = "http://tezy-gt37-tail"
python (Join-Path $repoRoot "src/host/host_endpoint.py")
