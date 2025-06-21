# PowerShell script to setup scheduled task for database backup
# Run this script as Administrator

param(
    [string]$TaskName = "Chi-Brows-DB-Backup",
    [string]$ScriptPath = (Join-Path $PSScriptRoot "backup-database.bat"),
    [string]$Time = "17:00"  # 5:00 PM
)

Write-Host "Setting up scheduled database backup task..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run as Administrator." -ForegroundColor Red
    exit 1
}

# Check if backup script exists
if (-not (Test-Path $ScriptPath)) {
    Write-Host "Backup script not found at: $ScriptPath" -ForegroundColor Red
    Write-Host "Please make sure backup-database.bat is in the same directory as this script." -ForegroundColor Red
    exit 1
}

try {
    # Remove existing task if it exists
    $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Removing existing task: $TaskName" -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    }

    # Create the action
    $action = New-ScheduledTaskAction -Execute $ScriptPath -WorkingDirectory (Split-Path $ScriptPath -Parent)

    # Create the trigger (daily at specified time)
    $trigger = New-ScheduledTaskTrigger -Daily -At $Time

    # Create the principal (run as SYSTEM with highest privileges)
    $principal = New-ScheduledTaskPrincipal -UserID "SYSTEM" -RunLevel Highest

    # Create the settings
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -DontStopOnIdleEnd

    # Register the scheduled task
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Daily backup of Chi-Brows database at $Time"

    Write-Host "Scheduled task created successfully!" -ForegroundColor Green
    Write-Host "Task Name: $TaskName" -ForegroundColor Cyan
    Write-Host "Schedule: Daily at $Time" -ForegroundColor Cyan
    Write-Host "Script Path: $ScriptPath" -ForegroundColor Cyan
    
    # Show the task details
    Write-Host "`nTask Details:" -ForegroundColor Yellow
    Get-ScheduledTask -TaskName $TaskName | Format-List TaskName, State, Description
    
    Write-Host "`nNext Run Time:" -ForegroundColor Yellow
    Get-ScheduledTask -TaskName $TaskName | Get-ScheduledTaskInfo | Select-Object NextRunTime

    Write-Host "`nTo manually run the backup task, use:" -ForegroundColor Cyan
    Write-Host "Start-ScheduledTask -TaskName '$TaskName'" -ForegroundColor White

    Write-Host "`nTo view task history, use:" -ForegroundColor Cyan
    Write-Host "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-TaskScheduler/Operational'; ID=200,201} | Where-Object {`$_.Message -like '*$TaskName*'}" -ForegroundColor White

} catch {
    Write-Host "Error creating scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 