@echo off
title DaisySMS Debug Mode
color 0c
cls

echo ⚠ RUNNING IN DEBUG MODE ⚠
echo.
echo This will show all command outputs
echo.
pause

:: Run all steps with full output
echo [1/4] Node.js check...
node -v
if %errorlevel% neq 0 (
    echo ❌ Node.js check failed
    pause
    exit
)

echo.
echo [2/4] Installing modules...
npm install

echo.
echo [3/4] Deploying commands...
node deploy-commands.js

echo.
echo [4/4] Starting bot...
node index.js

pause