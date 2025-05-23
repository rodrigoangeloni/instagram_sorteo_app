@echo off
echo =========================================
echo    Instagram Sorteo App
echo =========================================
echo.

echo Verificando si Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js detectado correctamente.
echo.

echo Verificando archivo de configuracion...
if not exist "backend\.env" (
    echo ADVERTENCIA: No se encontro el archivo .env
    echo.
    echo Por favor:
    echo 1. Copia backend\.env.example como backend\.env
    echo 2. Edita backend\.env con tus credenciales de Facebook
    echo 3. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo Archivo .env encontrado.
echo.

echo Instalando dependencias...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias.
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor...
echo.
echo La aplicacion estara disponible en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.
echo NOTA: Funciona con cualquier cuenta profesional de Instagram
echo.

npm start
