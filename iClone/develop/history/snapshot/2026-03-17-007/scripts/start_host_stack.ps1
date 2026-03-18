param(
    [switch]$Detached = $true
)

$ErrorActionPreference = "Stop"

$paths = @(
    "runtime/edge-outbox",
    "runtime/host-inbox/xperia5iii-edge-001",
    "runtime/records",
    "runtime/llm_inbox",
    "runtime/logs",
    "runtime/ollama",
    "runtime/syncthing/config"
)

foreach ($path in $paths) {
    if (-not (Test-Path -LiteralPath $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

if ($Detached) {
    docker compose up -d
} else {
    docker compose up
}

