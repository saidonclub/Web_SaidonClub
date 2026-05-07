Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Select-Object ProcessId, CommandLine | Format-List
