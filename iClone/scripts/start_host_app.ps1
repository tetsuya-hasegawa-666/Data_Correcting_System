param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonExe = (Get-Command python).Source
Set-Location $projectRoot

python .\src\host\build_status_snapshot.py | Out-Null
python .\src\host\build_review_snapshot.py | Out-Null

& (Join-Path $projectRoot "scripts\stop_host_app.ps1")
Start-Process -FilePath $pythonExe -ArgumentList ".\src\host\run_host_app.py" -WorkingDirectory $projectRoot | Out-Null
Start-Sleep -Seconds 2

Start-Process "http://127.0.0.1:8874/preview/index.html" | Out-Null
