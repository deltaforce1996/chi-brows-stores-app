@echo off
setlocal enabledelayedexpansion

REM Configuration
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=chi_brows_stores_dev
set DB_USER=root
set DB_PASSWORD=root
set BACKUP_DIR=%~dp0backups
set PUBLIC_DIR=%~dp0server\public
set TEMP_DIR=%BACKUP_DIR%\temp
set MAX_BACKUPS=7

REM Create backup directories if they don't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

REM Generate timestamp for backup filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

REM Backup filenames
set BACKUP_FILE=%TEMP_DIR%\%DB_NAME%_backup_%datestamp%.sql
set ZIP_FILE=%BACKUP_DIR%\%DB_NAME%_complete_backup_%datestamp%.zip
set PUBLIC_BACKUP_DIR=%TEMP_DIR%\public_%datestamp%

REM Log file
set LOG_FILE=%BACKUP_DIR%\backup.log

REM Start backup process
echo [%date% %time%] Starting complete backup (database + public files)... >> "%LOG_FILE%"
echo Database: %DB_NAME% >> "%LOG_FILE%"
echo Public directory: %PUBLIC_DIR% >> "%LOG_FILE%"
echo Final ZIP file: %ZIP_FILE% >> "%LOG_FILE%"

REM Check if Docker is running and database is accessible
docker exec chi-brows-stores-app-mysql-1 mysqladmin ping -h localhost -u %DB_USER% -p%DB_PASSWORD% > nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] ERROR: Cannot connect to MySQL database. Make sure Docker containers are running. >> "%LOG_FILE%"
    echo ERROR: Cannot connect to MySQL database. Make sure Docker containers are running.
    exit /b 1
)

REM Clean temp directory first
echo [%date% %time%] Cleaning temporary directory... >> "%LOG_FILE%"
if exist "%TEMP_DIR%\*" del /q "%TEMP_DIR%\*" >nul 2>&1
if exist "%TEMP_DIR%\public_%datestamp%" rd /s /q "%TEMP_DIR%\public_%datestamp%" >nul 2>&1

REM Perform database backup using Docker exec
echo [%date% %time%] Performing database backup... >> "%LOG_FILE%"
docker exec chi-brows-stores-app-mysql-1 mysqldump -h localhost -u %DB_USER% -p%DB_PASSWORD% --single-transaction --routines --triggers %DB_NAME% > "%BACKUP_FILE%"

if errorlevel 1 (
    echo [%date% %time%] ERROR: Database backup failed! >> "%LOG_FILE%"
    echo ERROR: Database backup failed!
    exit /b 1
) else (
    echo [%date% %time%] Database backup completed: %BACKUP_FILE% >> "%LOG_FILE%"
    echo Database backup completed successfully
)

REM Backup public directory
echo [%date% %time%] Backing up public directory... >> "%LOG_FILE%"
if exist "%PUBLIC_DIR%" (
    xcopy "%PUBLIC_DIR%" "%PUBLIC_BACKUP_DIR%\" /E /I /H /Y >nul 2>&1
    if errorlevel 1 (
        echo [%date% %time%] WARNING: Failed to copy some files from public directory >> "%LOG_FILE%"
        echo WARNING: Failed to copy some files from public directory
    ) else (
        echo [%date% %time%] Public directory backup completed: %PUBLIC_BACKUP_DIR% >> "%LOG_FILE%"
        echo Public directory backup completed successfully
    )
) else (
    echo [%date% %time%] WARNING: Public directory not found: %PUBLIC_DIR% >> "%LOG_FILE%"
    echo WARNING: Public directory not found: %PUBLIC_DIR%
)

REM Create ZIP file containing both database and public files
echo [%date% %time%] Creating ZIP archive... >> "%LOG_FILE%"
echo Creating ZIP archive...
powershell -Command "Compress-Archive -Path '%BACKUP_FILE%','%PUBLIC_BACKUP_DIR%' -DestinationPath '%ZIP_FILE%' -Force"

if errorlevel 1 (
    echo [%date% %time%] ERROR: Failed to create ZIP archive! >> "%LOG_FILE%"
    echo ERROR: Failed to create ZIP archive!
    exit /b 1
) else (
    echo [%date% %time%] ZIP archive created successfully: %ZIP_FILE% >> "%LOG_FILE%"
    echo ZIP archive created successfully: %ZIP_FILE%
)

REM Get ZIP file size and cleanup temp files
for %%I in ("%ZIP_FILE%") do set "filesize=%%~zI"
set /a filesizeMB=%filesize%/1024/1024
echo [%date% %time%] ZIP file size: %filesizeMB% MB >> "%LOG_FILE%"

REM Cleanup temporary files
echo [%date% %time%] Cleaning up temporary files... >> "%LOG_FILE%"
if exist "%BACKUP_FILE%" del "%BACKUP_FILE%" >nul 2>&1
if exist "%PUBLIC_BACKUP_DIR%" rd /s /q "%PUBLIC_BACKUP_DIR%" >nul 2>&1

REM Cleanup old backup ZIP files (keep only last MAX_BACKUPS files)
echo [%date% %time%] Cleaning up old backup ZIP files (keeping last %MAX_BACKUPS% files)... >> "%LOG_FILE%"

REM Count backup ZIP files and delete oldest ones if exceeding MAX_BACKUPS
set count=0
for /f %%i in ('dir /b /o-d "%BACKUP_DIR%\%DB_NAME%_complete_backup_*.zip" 2^>nul ^| find /c /v ""') do set count=%%i

if %count% gtr %MAX_BACKUPS% (
    set /a delete_count=%count%-%MAX_BACKUPS%
    echo [%date% %time%] Found %count% backup ZIP files, deleting !delete_count! oldest files... >> "%LOG_FILE%"
    
    for /f "skip=%MAX_BACKUPS% delims=" %%f in ('dir /b /o-d "%BACKUP_DIR%\%DB_NAME%_complete_backup_*.zip" 2^>nul') do (
        del "%BACKUP_DIR%\%%f"
        echo [%date% %time%] Deleted old backup: %%f >> "%LOG_FILE%"
    )
) else (
    echo [%date% %time%] No cleanup needed. Current backup count: %count% >> "%LOG_FILE%"
)

echo [%date% %time%] Complete backup process finished. >> "%LOG_FILE%"
echo.
echo ==========================================
echo  Complete Backup Process Finished!
echo ==========================================
echo ZIP file created: %ZIP_FILE%
echo Contains: Database SQL + Public files
echo Check log file: %LOG_FILE%
echo.

endlocal 