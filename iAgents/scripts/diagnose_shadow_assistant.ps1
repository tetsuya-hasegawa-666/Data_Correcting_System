$ErrorActionPreference = "Continue"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Output "== iAgents Shadow Assistant Diagnostics =="
Write-Output "ProjectRoot: $projectRoot"
Write-Output "PWD: $(Get-Location)"

Write-Output "`n[1] Python"
Get-Command python | Select-Object Source
python --version

Write-Output "`n[2] Key Files"
$files = @(
  "launch_shadow_assistant.pyw",
  "debug_launch_shadow_assistant.py",
  "src\\iagents\\desktop_app.py",
  "src\\iagents\\server.py",
  "src\\iagents\\windows_detect.py"
)
foreach ($file in $files) {
  $path = Join-Path $projectRoot $file
  Write-Output ("{0} => {1}" -f $file, (Test-Path $path))
}

Write-Output "`n[3] Import Check"
$env:PYTHONPATH = "src"
@'
import sys
print("sys.path[0]=", sys.path[0])
import iagents
print("import iagents: OK")
from iagents.server import ServerController
print("import ServerController: OK")
from iagents.desktop_app import DesktopApp
print("import DesktopApp: OK")
'@ | python -

Write-Output "`n[4] Health Check"
@'
import time
import urllib.request
from iagents.server import ServerController

controller = ServerController("127.0.0.1", 8765)
controller.start()
time.sleep(1)
print(urllib.request.urlopen("http://127.0.0.1:8765/api/health").read().decode("utf-8"))
controller.stop()
'@ | python -

Write-Output "`n[5] Window Detection"
@'
from iagents.windows_detect import list_visible_window_titles, detect_excel_online_window
titles = list_visible_window_titles()
print("visible_windows=", len(titles))
print("excel_detected=", detect_excel_online_window() or "NONE")
'@ | python -

Write-Output "`n[6] Desktop Shortcut"
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "iAgents Shadow Assistant.lnk"
Write-Output "ShortcutPath: $shortcutPath"
Write-Output ("ShortcutExists: " + (Test-Path $shortcutPath))

Write-Output "`nDone."
