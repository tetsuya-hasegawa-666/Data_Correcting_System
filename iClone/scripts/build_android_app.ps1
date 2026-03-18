param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

& (Join-Path $projectRoot "scripts\sync_android_assets.ps1")
Set-Location (Join-Path $projectRoot "android")
"sdk.dir=C\:\\Android" | Set-Content -Encoding ascii .\local.properties
& .\gradlew.bat assembleDebug
