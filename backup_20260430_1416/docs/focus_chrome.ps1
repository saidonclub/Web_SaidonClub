$code = @"
using System;
using System.Runtime.InteropServices;

public class Win32 {
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

Add-Type -TypeDefinition $code
$proc = Get-Process chrome | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1

if ($proc) {
    [Win32]::ShowWindow($proc.MainWindowHandle, 3) # 3 = Maximized
    [Win32]::SetForegroundWindow($proc.MainWindowHandle)
    Write-Host "Chrome window brought to foreground: $($proc.MainWindowTitle)"
} else {
    Write-Host "Chrome window not found."
}
