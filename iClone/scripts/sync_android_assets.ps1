param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot "preview\mobile_quick_capture.html"
$targetDir = Join-Path $projectRoot "android\app\src\main\assets"
$target = Join-Path $targetDir "mobile_quick_capture.html"

New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
Copy-Item $source $target -Force
