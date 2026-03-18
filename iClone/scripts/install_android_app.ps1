param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$apk = Join-Path $projectRoot "android\app\build\outputs\apk\debug\app-debug.apk"

if (-not (Test-Path $apk)) {
    & (Join-Path $projectRoot "scripts\build_android_app.ps1")
}

adb install -r $apk
