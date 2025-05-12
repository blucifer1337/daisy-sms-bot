@echo off
:: DaisySMS Bot Launcher - Clean Version
title DaisySMS Bot Manager
mode con: cols=80 lines=25
cls

:: ======================================
:: OWNER CREDITS
:: ======================================
echo.
echo   -----------------------------------
echo    MADE BY BLUCIFER @driftzao
echo    Telegram: @blucifer1337
echo    Discord: @driftzap
echo   -----------------------------------
echo.

:: ======================================
:: MAIN MENU
:: ======================================
:menu
cls
echo.
echo   [ MAIN MENU ]
echo   ------------
echo   1. Install/Update Modules
echo   2. Deploy Slash Commands
echo   3. Run Bot
echo   4. Force Restart Bot
echo   5. Exit
echo.
set /p choice="Select option [1-5]: "

if "%choice%"=="1" goto install_modules
if "%choice%"=="2" goto deploy_commands
if "%choice%"=="3" goto run_bot
if "%choice%"=="4" goto force_restart
if "%choice%"=="5" exit /b

echo Invalid choice! Press any key to try again...
pause >nul
goto menu

:: ======================================
:: 1. INSTALL MODULES
:: ======================================
:install_modules
cls
echo.
echo   [ INSTALLING MODULES ]
echo   ---------------------
echo [Step 1/2] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Download from: https://nodejs.org/dist/v20.18.1/
    pause
    goto menu
)

echo [Step 2/2] Installing modules...
call npm install --no-progress
if %errorlevel% neq 0 (
    echo ERROR: Installation failed!
) else (
    echo SUCCESS: Modules installed
)
pause
goto menu

:: ======================================
:: 2. DEPLOY COMMANDS
:: ======================================
:deploy_commands
cls
echo.
echo   [ DEPLOYING COMMANDS ]
echo   ---------------------
call node deploy-commands.js
if %errorlevel% neq 0 (
    echo WARNING: Deployment had issues
) else (
    echo SUCCESS: Commands deployed
)
pause
goto menu

:: ======================================
:: 3. RUN BOT
:: ======================================
:run_bot
cls
echo.
echo   [ BOT IS RUNNING ]
echo   -----------------
echo Press CTRL+C to stop
echo.
node index.js
echo.
echo Bot stopped. Returning to menu...
timeout /t 3 >nul
goto menu

:: ======================================
:: 4. FORCE RESTART
:: ======================================
:force_restart
cls
echo.
echo   [ FORCE RESTARTING ]
echo   -------------------
taskkill /FI "WINDOWTITLE eq DaisySMS Bot*" /F >nul 2>&1
timeout /t 2 >nul
start "" "%~f0" run_bot
exit /b