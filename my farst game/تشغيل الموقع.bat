@echo off
title Rafiq Platform Server

echo ========================================
echo Starting Rafiq Local Server
echo ========================================

:: Check if Node is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Start the server script in the background
start "Rafiq Server" cmd /c "node server.js"

echo Server started! Opening your browser...
timeout /t 2 /nobreak >nul

:: Open browser
start http://localhost:3000/lobby.html

echo.
echo You can close this window now. The server will keep running in the other window.
pause >nul
