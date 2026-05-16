@echo off
setlocal enabledelayedexpansion

echo ====================================================================
echo SAIDONCLUB OS - DEPLOYER v1.0
echo ====================================================================
echo.
echo [PASO 0] Verificando requisitos...

where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js/npm no esta instalado.
    pause
    exit /b 1
)

if not exist ".env" (
    echo ERROR: No se encontro el archivo .env
    pause
    exit /b 1
)

echo Requisitos verificados.
echo.

echo [PASO 1] Configurando variables en Vercel...
echo.

set "GH_TOKEN=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"

for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    set "key=%%A"
    set "val=%%B"
    if "!key!" neq "" (
        set "firstchar=!key:~0,1!"
        if "!firstchar!" neq "#" (
            echo Configurando: !key! ...
            call npx vercel env rm !key! production -y >nul 2>&1
            echo !val!| call npx vercel env add !key! production >nul 2>&1
            if !errorlevel! equ 0 (
                echo    OK.
            ) else (
                echo    Error en !key!.
            )
        )
    )
)

echo.
echo [PASO 2] Sincronizando con GitHub...
echo.
git remote set-url origin https://%GH_TOKEN%@github.com/HugoVillegas/Web_SaidonClub.git
git add .
git commit -m "chore: deployment update [automated]" >nul 2>&1
git push origin main
if %errorlevel% equ 0 (
    echo OK: GitHub actualizado.
) else (
    echo ERROR: GitHub.
)

echo.
echo [PASO 3] Desplegando en Vercel...
echo.
call npx vercel --prod --yes
if %errorlevel% equ 0 (
    echo EXITOSO.
) else (
    echo FALLIDO.
)

pause
