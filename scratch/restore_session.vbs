Set WshShell = WScript.CreateObject("WScript.Shell")
' Try to activate the window several times
For i = 1 to 5
    WshShell.AppActivate "Google Chrome"
    WshShell.AppActivate "Nueva pestaña - Google Chrome"
    WshShell.AppActivate "SaidonClub"
    WScript.Sleep 1000
    WshShell.SendKeys "{ENTER}"
Next
