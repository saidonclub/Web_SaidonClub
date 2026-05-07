Add-Type -AssemblyName UIAutomationClient

$automation = [System.Windows.Automation.AutomationElement]::RootElement
$condition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty, "¿Quién usa Chrome?")
$chromePicker = $automation.FindFirst([System.Windows.Automation.TreeScope]::Children, $condition)

if ($chromePicker) {
    Write-Host "Encontrado el selector de perfiles de Chrome."
    # Buscar el perfil 34
    $profileCondition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty, "Profile 34")
    $profileButton = $chromePicker.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $profileCondition)
    
    if ($profileButton) {
        Write-Host "Encontrado Profile 34, intentando hacer clic..."
        $invokePattern = $profileButton.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern) -as [System.Windows.Automation.InvokePattern]
        if ($invokePattern) {
            $invokePattern.Invoke()
            Write-Host "Clic realizado con éxito."
        } else {
            Write-Host "El botón no soporta InvokePattern. Intentando usar el mouse..."
            $rect = $profileButton.Current.BoundingRectangle
            $x = [int]($rect.Left + $rect.Width / 2)
            $y = [int]($rect.Top + $rect.Height / 2)
            Add-Type -AssemblyName System.Windows.Forms
            [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($x, $y)
            # You would need user32.dll for physical click if Invoke fails, but Invoke usually works for UIA.
        }
    } else {
        Write-Host "No se encontró Profile 34 en la vista actual."
    }
} else {
    Write-Host "No se encontró la ventana del selector de perfiles."
}
