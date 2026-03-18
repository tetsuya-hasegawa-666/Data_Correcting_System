param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonExe = (Get-Command python).Source
Set-Location $projectRoot

& (Join-Path $projectRoot "scripts\stop_adb_bridge.ps1")
Start-Process -FilePath $pythonExe -ArgumentList ".\src\host\adb_bridge.py" -WorkingDirectory $projectRoot | Out-Null
