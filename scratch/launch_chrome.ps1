$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$userData   = "C:\Users\Gatita\AppData\Local\Google\Chrome\User Data"
$profileDir = "Profile 34"
$port       = 9222

# Verificar comando exacto que recibe Chrome
$args = @(
    "--remote-debugging-port=$port",
    "--user-data-dir=$userData",
    "--profile-directory=$profileDir",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-infobars",
    "--password-store=basic"
)

Write-Host "[1] Matando chrome..."
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "[2] Comprobando si hay procesos chrome..."
$procs = Get-Process -Name chrome -ErrorAction SilentlyContinue
if ($procs) {
    Write-Host "  ADVERTENCIA: Aun hay $($procs.Count) procesos chrome."
} else {
    Write-Host "  Limpio."
}

Write-Host "[3] Lanzando Chrome con args:"
$args | ForEach-Object { Write-Host "    $_" }

$proc = Start-Process -FilePath $chromePath -ArgumentList $args -PassThru
Write-Host "[4] PID: $($proc.Id)"

Start-Sleep -Seconds 5

Write-Host "[5] Verificando puerto $port..."
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/json/version" -TimeoutSec 5
    $json = $response.Content | ConvertFrom-Json
    Write-Host "  EXITO - Browser: $($json.Browser)"
    Write-Host "  WebSocket: $($json.webSocketDebuggerUrl)"
} catch {
    Write-Host "  FALLO: $_"
    
    # Verificar si el puerto esta escuchando
    $listening = netstat -ano | findstr ":$port"
    Write-Host "  netstat :$port -> $listening"
    
    # Mostrar flags del proceso chrome principal
    Write-Host "`n  Flags del proceso chrome principal:"
    Get-CimInstance Win32_Process -Filter "ProcessId = $($proc.Id)" | Select-Object CommandLine | Format-List
}
