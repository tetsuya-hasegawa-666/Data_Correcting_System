param()

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$desktop = [Environment]::GetFolderPath("Desktop")
$shell = New-Object -ComObject WScript.Shell

$items = @(
    @{
        Name = "iClone Start"
        Target = "powershell.exe"
        Arguments = "-ExecutionPolicy Bypass -File `"$projectRoot\scripts\start_iclone.ps1`""
    },
    @{
        Name = "iClone Host App Stop"
        Target = "powershell.exe"
        Arguments = "-ExecutionPolicy Bypass -File `"$projectRoot\scripts\stop_iclone.ps1`""
    }
)

foreach ($item in $items) {
    $shortcut = $shell.CreateShortcut((Join-Path $desktop ($item.Name + ".lnk")))
    $shortcut.TargetPath = $item.Target
    $shortcut.Arguments = $item.Arguments
    $shortcut.WorkingDirectory = $projectRoot
    $shortcut.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,220"
    $shortcut.Save()
}

$legacy = @(
    "iClone Host App.lnk",
    "iClone Host Stack.lnk"
)

foreach ($name in $legacy) {
    $path = Join-Path $desktop $name
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Force
    }
}
