@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ====================================================================
echo 🚀 SAIDONCLUB OS - AUTO-DEPLOY Y CONFIGURADOR DE VERCEL
echo ====================================================================
echo.
echo Este script inyectara las variables de entorno de .env.production
echo en tu proyecto de Vercel para el entorno de Produccion y luego
echo forzara un despliegue completo en la nube.
echo.
pause

echo.
echo [1/3] Sincronizando variables de entorno a Vercel (Produccion)...
echo.

if not exist ".env" (
    echo ❌ ERROR: No se encontro el archivo .env
    pause
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    set "key=%%A"
    set "val=%%B"
    
    rem Filtramos comentarios y lineas vacias
    if "!key:~0,1!" neq "#" if "!key!" neq "" if "!val!" neq "" (
        echo 🔧 Configurando: !key!
        
        rem Primero removemos la variable por si ya existe para evitar bloqueos
        npx vercel env rm !key! production -y >nul 2>&1
        
        rem Ahora la añadimos nueva
        echo !val! | npx vercel env add !key! production >nul
        echo     ✅ Lista.
    )
)

echo.
echo [2/3] Verificando el codigo en GitHub...
call git push origin main

echo.
echo [3/3] Desplegando aplicacion a Vercel (Produccion)...
echo.
call npx vercel --prod --yes

echo.
echo ====================================================================
echo 🎉 PROCESO COMPLETADO
echo ====================================================================
echo Si Vercel se instalo correctamente, la web ya deberia estar subiendo.
pause
