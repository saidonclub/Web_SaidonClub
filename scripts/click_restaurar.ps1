
# Script: click_restaurar.ps1
# Propósito: Conectar al DevTools de Chrome y hacer clic en el botón "Restaurar"
# via Chrome DevTools Protocol (CDP) usando WebSocket

Add-Type -AssemblyName System.Net.WebSockets.Client

$targetId = "0E8B414FC959EC50759E89564134E6A1"
$wsUri = "ws://localhost:9222/devtools/page/$targetId"

$ws = New-Object System.Net.WebSockets.ClientWebSocket
$ct = [System.Threading.CancellationToken]::None

try {
    $ws.ConnectAsync($wsUri, $ct).Wait()
    Write-Host "[OK] WebSocket conectado"

    # Ejecutar JS para hacer click en Restaurar
    $msg = '{"id":1,"method":"Runtime.evaluate","params":{"expression":"(function(){ var btns = document.querySelectorAll(\"button\"); for(var b of btns){ if(b.textContent.includes(\"Restaurar\") || b.textContent.includes(\"Restore\")){ b.click(); return \"CLICKED:\"+b.textContent; } } return \"NO BUTTON FOUND\"; })()","returnByValue":true}}'
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
    $segment = New-Object System.ArraySegment[byte] -ArgumentList (,$bytes)
    $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
    Write-Host "[OK] Mensaje enviado"

    # Recibir respuesta
    $buffer = New-Object byte[] 4096
    $seg2 = New-Object System.ArraySegment[byte] -ArgumentList (,$buffer)
    $result = $ws.ReceiveAsync($seg2, $ct).GetAwaiter().GetResult()
    $response = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
    Write-Host "[RESPUESTA] $response"

} catch {
    Write-Host "[ERROR] $_"
} finally {
    if ($ws.State -eq "Open") { $ws.CloseAsync("NormalClosure","done",$ct).Wait() }
}
