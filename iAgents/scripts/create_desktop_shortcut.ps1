$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "iAgents Shadow Assistant.lnk"
$pythonw = (Get-Command pythonw).Source
$scriptPath = Join-Path $projectRoot "launch_shadow_assistant.pyw"

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $pythonw
$shortcut.Arguments = "`"$scriptPath`""
$shortcut.WorkingDirectory = $projectRoot
$shortcut.IconLocation = "$pythonw,0"
$shortcut.Description = "Launch iAgents Excel Online Shadow Assistant"
$shortcut.Save()

Write-Output "Created: $shortcutPath"
