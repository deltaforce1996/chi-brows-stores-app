@echo off
echo ==========================================
echo  Chi-Brows Database Backup Quick Setup
echo ==========================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires Administrator privileges.
    echo Please right-click and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Docker status...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo [2/3] Checking if containers are running...
docker ps | findstr mysql >nul 2>&1
if errorlevel 1 (
    echo WARNING: MySQL container is not running.
    echo Starting Docker Compose...
    docker-compose up -d
    if errorlevel 1 (
        echo ERROR: Failed to start Docker containers
        echo Please check docker-compose.yml and try again.
        pause
        exit /b 1
    )
    echo Waiting for containers to start...
    timeout /t 10 /nobreak >nul
) else (
    echo MySQL container is running.
)

echo [3/3] Setting up scheduled backup task...
powershell -ExecutionPolicy Bypass -File "%~dp0setup-backup-schedule.ps1"

if errorlevel 1 (
    echo ERROR: Failed to setup scheduled task
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Setup completed successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Test the backup by running: backup-database.bat
echo 2. Check the backup files in the 'backups' folder
echo 3. Monitor the scheduled task in Windows Task Scheduler
echo.
echo The database will be backed up daily at 5:00 PM
echo.
pause 