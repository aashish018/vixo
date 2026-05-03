@echo off
echo.
echo =========================================
echo   WallpaperVault - Starting...
echo =========================================
echo.

echo Starting Spring Boot backend on port 8080...
start "WallpaperVault Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 20 seconds for backend to initialize...
timeout /t 20 /nobreak > nul

echo Starting Vite frontend on port 5173...
start "WallpaperVault Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo =========================================
echo   App is starting!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8080
echo   Admin    : http://localhost:5173/admin
echo =========================================
echo.
pause
