param(
    [switch]$Detached = $true
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$dockerCli = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$logFile = Join-Path $projectRoot "runtime\logs\start_host_stack.log"
$mutexName = "iCloneHostStackStart"
$stackMutex = $null

function Append-SharedLogLine {
    param([string]$Line)
    $directory = Split-Path -Parent $logFile
    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    $stream = [System.IO.File]::Open($logFile, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    try {
        $writer = New-Object System.IO.StreamWriter($stream)
        $writer.WriteLine($Line)
        $writer.Flush()
    }
    finally {
        if ($writer) { $writer.Dispose() }
        $stream.Dispose()
    }
}

function Write-StackLog {
    param([string]$Message)
    $stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssK"
    Append-SharedLogLine "$stamp $Message"
}

function Enter-StackMutex {
    $script:stackMutex = New-Object System.Threading.Mutex($false, $mutexName)
    if (-not $script:stackMutex.WaitOne(2000)) {
        Write-StackLog "another stack start is already running; skipping duplicate request"
        exit 0
    }
}

function Exit-StackMutex {
    if ($script:stackMutex) {
        try {
            $script:stackMutex.ReleaseMutex() | Out-Null
        }
        catch {
        }
        $script:stackMutex.Dispose()
        $script:stackMutex = $null
    }
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

function Invoke-DockerCompose {
    param([string[]]$Arguments)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $dockerCli
    $psi.Arguments = ($Arguments -join " ")
    $psi.WorkingDirectory = $projectRoot
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    [void]$process.Start()

    while (-not $process.StandardOutput.EndOfStream) {
        Write-StackLog ($process.StandardOutput.ReadLine())
    }
    while (-not $process.StandardError.EndOfStream) {
        Write-StackLog ($process.StandardError.ReadLine())
    }

    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
        throw "docker compose exited with code $($process.ExitCode). See runtime\\logs\\start_host_stack.log"
    }
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

Enter-StackMutex
try {
    Start-DockerDesktopIfNeeded

    Write-StackLog "starting docker compose"
    if ($Detached) {
        Invoke-DockerCompose @("compose", "up", "-d")
    }
    else {
        Invoke-DockerCompose @("compose", "up")
    }
}
finally {
    Exit-StackMutex
}
