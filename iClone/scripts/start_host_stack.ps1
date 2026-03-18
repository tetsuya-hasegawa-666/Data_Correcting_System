param(
    [switch]$Detached = $true
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$dockerCli = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$logFile = Join-Path $projectRoot "runtime\logs\start_host_stack.log"

function Write-StackLog {
    param([string]$Message)
    $logDir = Split-Path -Parent $logFile
    if (-not (Test-Path -LiteralPath $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    $stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssK"
    Add-Content -Path $logFile -Value "$stamp $Message"
}

function Test-DockerReady {
    if (-not (Test-Path -LiteralPath $dockerCli)) {
        return $false
    }
    try {
        & $dockerCli ps | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Start-DockerDesktopIfNeeded {
    if (Test-DockerReady) {
        Write-StackLog "docker daemon already ready"
        return
    }

    if (-not (Test-Path -LiteralPath $dockerDesktop)) {
        throw "Docker Desktop.exe not found: $dockerDesktop"
    }

    Write-StackLog "starting Docker Desktop"
    Start-Process -FilePath $dockerDesktop | Out-Null

    $maxWaitSeconds = 120
    $elapsed = 0
    while ($elapsed -lt $maxWaitSeconds) {
        Start-Sleep -Seconds 4
        $elapsed += 4
        if (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue) {
            Write-StackLog "Docker Desktop process detected"
        }
        if (Test-DockerReady) {
            Write-StackLog "docker daemon ready"
            return
        }
    }

    Write-StackLog "docker daemon wait timed out"
    throw "Docker Desktop started but docker daemon was not ready within $maxWaitSeconds seconds. See runtime\\logs\\start_host_stack.log"
}

$paths = @(
    "runtime/edge-outbox",
    "runtime/host-inbox/xperia5iii-edge-001",
    "runtime/records",
    "runtime/llm_inbox",
    "runtime/logs",
    "runtime/ollama",
    "runtime/syncthing/config",
    "runtime/dead-letter"
)

foreach ($path in $paths) {
    if (-not (Test-Path -LiteralPath $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

Start-DockerDesktopIfNeeded

Write-StackLog "starting docker compose"
if ($Detached) {
    docker compose up -d | Tee-Object -FilePath $logFile -Append
}
else {
    docker compose up | Tee-Object -FilePath $logFile -Append
}
