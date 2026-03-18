param()

$processes = Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -like "*run_host_app.py*"
}

foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force
}
