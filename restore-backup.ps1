# PowerShell script to restore from ZIP backup
# Usage: .\restore-backup.ps1 -BackupFile "backups\chi_brows_stores_complete_backup_2024-01-15_17-00-00.zip"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    
    [string]$TempDir = "temp_restore",
    [string]$PublicDir = "server\public",
    [switch]$SkipDatabase,
    [switch]$SkipPublic,
    [switch]$Force
)

Write-Host "Chi-Brows Backup Restore Tool" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "ERROR: Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

# Check if running as Administrator for Docker commands
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "WARNING: This script should be run as Administrator for Docker operations." -ForegroundColor Yellow
}

try {
    # Clean and create temp directory
    if (Test-Path $TempDir) {
        if ($Force) {
            Remove-Item $TempDir -Recurse -Force
        } else {
            Write-Host "Temp directory exists. Use -Force to overwrite or remove manually: $TempDir" -ForegroundColor Yellow
            exit 1
        }
    }
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

    Write-Host "Extracting backup file..." -ForegroundColor Cyan
    Expand-Archive -Path $BackupFile -DestinationPath $TempDir -Force
    
    # List contents
    Write-Host "`nBackup contents:" -ForegroundColor Yellow
    Get-ChildItem $TempDir -Recurse | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize

    # Find SQL file
    $sqlFile = Get-ChildItem "$TempDir\*.sql" | Select-Object -First 1
    if (-not $sqlFile -and -not $SkipDatabase) {
        Write-Host "WARNING: No SQL file found in backup" -ForegroundColor Yellow
        $SkipDatabase = $true
    }

    # Find public directory
    $publicBackupDir = Get-ChildItem "$TempDir\public_*" -Directory | Select-Object -First 1
    if (-not $publicBackupDir -and -not $SkipPublic) {
        Write-Host "WARNING: No public directory found in backup" -ForegroundColor Yellow
        $SkipPublic = $true
    }

    # Restore database
    if (-not $SkipDatabase -and $sqlFile) {
        Write-Host "`nRestoring database..." -ForegroundColor Cyan
        Write-Host "SQL File: $($sqlFile.FullName)" -ForegroundColor White
        
        # Check if Docker container is running
        $dockerCheck = docker ps --filter "name=chi-brows-stores-app-mysql-1" --format "{{.Names}}" 2>$null
        if (-not $dockerCheck) {
            Write-Host "ERROR: MySQL Docker container is not running" -ForegroundColor Red
            Write-Host "Please start your Docker containers first: docker-compose up -d" -ForegroundColor Yellow
            exit 1
        }

        # Test database connection
        $pingResult = docker exec chi-brows-stores-app-mysql-1 mysqladmin ping -h localhost -u root -proot 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Cannot connect to MySQL database" -ForegroundColor Red
            exit 1
        }

        # Perform database restore
        Get-Content $sqlFile.FullName | docker exec -i chi-brows-stores-app-mysql-1 mysql -u root -proot chi_brows_stores
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database restored successfully!" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Database restore failed" -ForegroundColor Red
            exit 1
        }
    } elseif (-not $SkipDatabase) {
        Write-Host "Skipping database restore (no SQL file found)" -ForegroundColor Yellow
    }

    # Restore public directory
    if (-not $SkipPublic -and $publicBackupDir) {
        Write-Host "`nRestoring public directory..." -ForegroundColor Cyan
        Write-Host "Public Backup Dir: $($publicBackupDir.FullName)" -ForegroundColor White
        Write-Host "Target Dir: $PublicDir" -ForegroundColor White

        # Backup existing public directory
        if (Test-Path $PublicDir) {
            $backupName = "public_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            $backupPath = "server\$backupName"
            Write-Host "Backing up existing public directory to: $backupPath" -ForegroundColor Yellow
            Move-Item $PublicDir $backupPath
        }

        # Restore public directory
        Copy-Item $publicBackupDir.FullName $PublicDir -Recurse -Force
        
        if (Test-Path $PublicDir) {
            Write-Host "Public directory restored successfully!" -ForegroundColor Green
            Write-Host "Files restored: $(Get-ChildItem $PublicDir -Recurse | Measure-Object).Count" -ForegroundColor Cyan
        } else {
            Write-Host "ERROR: Public directory restore failed" -ForegroundColor Red
        }
    } elseif (-not $SkipPublic) {
        Write-Host "Skipping public directory restore (no directory found)" -ForegroundColor Yellow
    }

    Write-Host "`nRestore completed successfully!" -ForegroundColor Green

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Cleanup temp directory
    if (Test-Path $TempDir) {
        Write-Host "`nCleaning up temporary files..." -ForegroundColor Cyan
        Remove-Item $TempDir -Recurse -Force
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Restore process completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green 