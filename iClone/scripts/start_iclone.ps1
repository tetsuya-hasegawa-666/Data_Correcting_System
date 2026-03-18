param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

& (Join-Path $projectRoot "scripts\start_host_stack.ps1")
Start-Sleep -Seconds 2
& (Join-Path $projectRoot "scripts\start_adb_bridge.ps1")
Start-Sleep -Seconds 1
& (Join-Path $projectRoot "scripts\start_host_app.ps1")
