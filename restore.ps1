Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms

$proc = Get-Process -Name chrome | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1

if ($null -ne $proc) {
    [Microsoft.VisualBasic.Interaction]::AppActivate($proc.Id)
    Start-Sleep -Milliseconds 1000
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    Write-Host "Sent ENTER to Chrome"
} else {
    Write-Host "No Chrome window found"
}
