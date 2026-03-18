param()

$projectRoot = Split-Path -Parent $PSScriptRoot
& (Join-Path $projectRoot "scripts\stop_host_app.ps1")
& (Join-Path $projectRoot "scripts\stop_adb_bridge.ps1")
