param()

$processes = Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -like "*adb_bridge.py*"
}

foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force
}
