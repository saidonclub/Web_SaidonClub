Add-Type -AssemblyName System.Windows.Forms, System.Drawing
$Screen = [Windows.Forms.Screen]::PrimaryScreen
$Width  = $Screen.Bounds.Width
$Height = $Screen.Bounds.Height
$Left   = $Screen.Bounds.Left
$Top    = $Screen.Bounds.Top

$Bitmap  = New-Object Drawing.Bitmap $Width, $Height
$Graphics = [Drawing.Graphics]::FromImage($Bitmap)
$Graphics.CopyFromScreen($Left, $Top, 0, 0, $Bitmap.Size)

$Path = "c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\docs\system_screenshot.png"
$Bitmap.Save($Path, [Drawing.Imaging.ImageFormat]::Png)

$Graphics.Dispose()
$Bitmap.Dispose()

Write-Host "Screenshot saved to $Path"
