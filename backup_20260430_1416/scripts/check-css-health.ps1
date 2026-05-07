# ============================================================
# SaidonClub OS v5.2 — CSS Health Check & Auto-Recovery
# Uso: .\scripts\check-css-health.ps1
# Ejecutar antes de cualquier sesión de desarrollo
# ============================================================

param(
  [string]$WebDir = "$PSScriptRoot\..\apps\web",
  [switch]$AutoFix = $false,
  [switch]$Silent = $false
)

$ErrorActionPreference = "Stop"
$status = @{ ok = 0; warn = 0; error = 0 }

function Log-OK   { param($msg) if (!$Silent) { Write-Host "  [OK] $msg" -ForegroundColor Green }; $status.ok++ }
function Log-WARN { param($msg) Write-Host "  [WARN] $msg" -ForegroundColor Yellow; $status.warn++ }
function Log-ERR  { param($msg) Write-Host "  [ERROR] $msg" -ForegroundColor Red; $status.error++ }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SaidonClub CSS Health Check v1.0" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar que globals.css existe y tiene tokens clave
Write-Host "[1] Verificando globals.css..." -ForegroundColor White
$globalsCss = Join-Path $WebDir "app\globals.css"
if (Test-Path $globalsCss) {
  $content = Get-Content $globalsCss -Raw
  $checks = @("--clr-orange", "--clr-bg-base", "Inter", "Obsidian")
  $allFound = $true
  foreach ($token in $checks) {
    if ($content -notmatch [regex]::Escape($token)) {
      Log-ERR "Token faltante en globals.css: $token"
      $allFound = $false
    }
  }
  if ($allFound) { Log-OK "globals.css contiene todos los tokens del Design System" }
} else {
  Log-ERR "globals.css NO ENCONTRADO en $globalsCss"
}

# 2. Verificar que layout.tsx importa globals.css
Write-Host "[2] Verificando import en layout.tsx..." -ForegroundColor White
$layoutTsx = Join-Path $WebDir "app\layout.tsx"
if (Test-Path $layoutTsx) {
  $layoutContent = Get-Content $layoutTsx -Raw
  if ($layoutContent -match "globals\.css") {
    Log-OK "layout.tsx importa globals.css correctamente"
  } else {
    Log-ERR "layout.tsx NO importa globals.css — el CSS global no se cargará"
    if ($AutoFix) {
      Log-WARN "AutoFix: Añadiendo import a layout.tsx..."
      $importLine = "import './globals.css';"
      $layoutContent = "$importLine`n$layoutContent"
      Set-Content $layoutTsx $layoutContent -Encoding UTF8
      Log-OK "Import añadido a layout.tsx"
    }
  }
} else {
  Log-ERR "layout.tsx no encontrado"
}

# 3. Verificar estado de caché .next
Write-Host "[3] Verificando caché .next..." -ForegroundColor White
$nextDir = Join-Path $WebDir ".next"
if (Test-Path $nextDir) {
  $cssFiles = Get-ChildItem "$nextDir\static\css" -Filter "*.css" -Recurse -ErrorAction SilentlyContinue
  if ($cssFiles -and $cssFiles.Count -gt 0) {
    Log-OK ".next/static/css tiene $($cssFiles.Count) archivo(s) CSS compilados"
    # Verificar que los archivos no están vacíos
    $emptyFiles = $cssFiles | Where-Object { $_.Length -eq 0 }
    if ($emptyFiles) {
      Log-WARN "$($emptyFiles.Count) archivo(s) CSS están VACÍOS — posible compilación corrupta"
      if ($AutoFix) {
        Write-Host "  AutoFix: Eliminando caché corrupta..." -ForegroundColor Yellow
        Remove-Item $nextDir -Recurse -Force
        Log-OK ".next eliminado — reinicia el servidor con: npm run dev"
      }
    }
  } else {
    Log-WARN ".next/static/css vacío — el servidor aún no compiló o la caché está corrupta"
    if ($AutoFix) {
      Write-Host "  AutoFix: Eliminando .next para forzar recompilación limpia..." -ForegroundColor Yellow
      Remove-Item $nextDir -Recurse -Force
      Log-OK ".next eliminado — reinicia con: npm run dev"
    }
  }
} else {
  Log-WARN ".next no existe — el servidor nunca ha compilado (normal en primera ejecución)"
}

# 4. Verificar next.config.js
Write-Host "[4] Verificando next.config.js..." -ForegroundColor White
$nextConfig = Join-Path $WebDir "next.config.js"
if (Test-Path $nextConfig) {
  $configContent = Get-Content $nextConfig -Raw
  if ($configContent -match "images\.unsplash\.com") {
    Log-OK "next.config.js permite imágenes de Unsplash"
  } else {
    Log-WARN "next.config.js no permite Unsplash — imágenes externas pueden fallar"
  }
  Log-OK "next.config.js encontrado y legible"
} else {
  Log-ERR "next.config.js no encontrado"
}

# 5. Verificar que el servidor responde en :3000
Write-Host "[5] Verificando servidor en :3000..." -ForegroundColor White
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($port3000) {
  # Intentar hit rápido al CSS
  try {
    $response = Invoke-WebRequest "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
      Log-OK "Servidor respondiendo en :3000 (HTTP 200)"
    }
  } catch {
    Log-WARN "Servidor en :3000 pero no responde — puede estar compilando"
  }
} else {
  Log-WARN "Ningún proceso escucha en :3000 — servidor apagado"
  Write-Host "  Inicia con: cd apps/web ; npm run dev" -ForegroundColor Cyan
}

# 6. Resumen
Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  OK:      $($status.ok)" -ForegroundColor Green
Write-Host "  WARN:    $($status.warn)" -ForegroundColor Yellow
Write-Host "  ERROR:   $($status.error)" -ForegroundColor Red

if ($status.error -gt 0) {
  Write-Host "`n  ACCION REQUERIDA: Hay errores críticos que impiden la carga de CSS" -ForegroundColor Red
  Write-Host "  Ejecuta con -AutoFix para correcciones automáticas:`n" -ForegroundColor Yellow
  Write-Host "    .\scripts\check-css-health.ps1 -AutoFix`n" -ForegroundColor White
  exit 1
} elseif ($status.warn -gt 0) {
  Write-Host "`n  Sistema funcional con advertencias menores`n" -ForegroundColor Yellow
  exit 0
} else {
  Write-Host "`n  Sistema completamente saludable - CSS pipeline OK`n" -ForegroundColor Green
  exit 0
}
