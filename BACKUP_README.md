# Complete Backup System

ระบบสำรองข้อมูลแบบครบครัน Chi-Brows Stores App ที่รวมทั้งฐานข้อมูลและไฟล์ Public ที่ทำงานอัตโนมัติทุกวันเวลา 17:00 น. (5 โมงเย็น)

## ไฟล์ที่เกี่ยวข้อง

1. **backup-database.bat** - Script สำหรับสำรองข้อมูลฐานข้อมูลและไฟล์ public
2. **setup-backup-schedule.ps1** - Script สำหรับตั้งค่า Windows Task Scheduler
3. **quick-setup.bat** - Script สำหรับติดตั้งแบบง่าย ๆ ในคลิกเดียว
4. **restore-backup.ps1** - Script สำหรับ restore จากไฟล์ ZIP backup
5. **BACKUP_README.md** - คู่มือการใช้งาน (ไฟล์นี้)

## ความต้องการของระบบ

- Windows 10/11
- Docker Desktop (สำหรับรัน MySQL container)
- PowerShell 5.0+ 
- สิทธิ์ Administrator

## การติดตั้งและตั้งค่า

### ขั้นตอนที่ 1: เตรียมความพร้อม

1. ตรวจสอบว่า Docker containers กำลังทำงานอยู่:
   ```bash
   docker-compose up -d
   ```

2. ตรวจสอบชื่อ MySQL container:
   ```bash
   docker ps | grep mysql
   ```
   (หากชื่อแตกต่างจาก `chi-brows-stores-app-mysql-1` ให้แก้ไขใน backup-database.bat)

### ขั้นตอนที่ 2: ตั้งค่า Scheduled Task

1. เปิด PowerShell แบบ **Run as Administrator**

2. เปลี่ยน directory ไปยังโฟลเดอร์ที่มีไฟล์ backup scripts:
   ```powershell
   cd "path\to\your\project\folder"
   ```

3. รัน script สำหรับตั้งค่า scheduled task:
   ```powershell
   .\setup-backup-schedule.ps1
   ```

### ขั้นตอนที่ 3: ทดสอบการทำงาน

1. ทดสอบ backup script โดยตรง:
   ```batch
   .\backup-database.bat
   ```

2. ทดสอบ scheduled task:
   ```powershell
   Start-ScheduledTask -TaskName "Chi-Brows-DB-Backup"
   ```

## ฟีเจอร์ของระบบ

### ฟีเจอร์หลัก
- ✅ สำรองข้อมูลอัตโนมัติทุกวันเวลา 17:00 น.
- ✅ สำรองฐานข้อมูล MySQL และโฟลเดอร์ `server/public`
- ✅ บีบอัดเป็นไฟล์ ZIP เดียวเพื่อความสะดวก
- ✅ สร้างชื่อไฟล์พร้อม timestamp
- ✅ เก็บไฟล์ backup ไว้ 7 ไฟล์ล่าสุด (ลบไฟล์เก่าอัตโนมัติ)
- ✅ บันทึก log การทำงาน
- ✅ ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนสำรอง
- ✅ รายงานขนาดไฟล์ backup
- ✅ ทำความสะอาดไฟล์ชั่วคราวอัตโนมัติ

### รายละเอียดการทำงาน
- **ที่เก็บไฟล์**: โฟลเดอร์ `backups/` ในไดเรกทอรีเดียวกับ script
- **รูปแบบชื่อไฟล์**: `chi_brows_stores_complete_backup_YYYY-MM-DD_HH-MM-SS.zip`
- **เนื้อหาใน ZIP**: 
  - `chi_brows_stores_backup_YYYY-MM-DD_HH-MM-SS.sql` (ฐานข้อมูล)
  - `public_YYYY-MM-DD_HH-MM-SS/` (โฟลเดอร์ public)
- **Log file**: `backups/backup.log`
- **การเก็บรักษา**: เก็บไฟล์ ZIP ล่าสุด 7 ไฟล์

## การจัดการและ Monitoring

### ดูสถานะ Scheduled Task
```powershell
Get-ScheduledTask -TaskName "Chi-Brows-DB-Backup"
```

### ดูเวลาที่จะรันครั้งถัดไป
```powershell
Get-ScheduledTask -TaskName "Chi-Brows-DB-Backup" | Get-ScheduledTaskInfo
```

### ดู Log การทำงาน
```powershell
Get-Content ".\backups\backup.log" -Tail 20
```

### ดูเนื้อหาของไฟล์ Backup ZIP
```powershell
# ดูรายการไฟล์ใน ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::OpenRead(".\backups\chi_brows_stores_complete_backup_YYYY-MM-DD_HH-MM-SS.zip").Entries | Select-Object Name, Length

# หรือใช้ 7-Zip (ถ้าติดตั้งแล้ว)
7z l ".\backups\chi_brows_stores_complete_backup_YYYY-MM-DD_HH-MM-SS.zip"
```

### ดูประวัติการทำงานจาก Windows Event Log
```powershell
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-TaskScheduler/Operational'; ID=200,201} | Where-Object {$_.Message -like '*Chi-Brows-DB-Backup*'} | Select-Object TimeCreated, Message
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Cannot connect to MySQL database**
   - ตรวจสอบว่า Docker containers กำลังทำงาน
   - ตรวจสอบชื่อ container ใน backup-database.bat

2. **Permission denied**
   - ตรวจสอบสิทธิ์การเขียนไฟล์ในโฟลเดอร์ backup
   - รัน script ด้วยสิทธิ์ Administrator

3. **Backup file is empty or corrupted**
   - ตรวจสอบ MySQL credentials ใน backup-database.bat
   - ทดสอบเชื่อมต่อฐานข้อมูลด้วยตนเอง

### การปรับแต่งการตั้งค่า

#### เปลี่ยนเวลาการ backup
แก้ไขในไฟล์ `setup-backup-schedule.ps1`:
```powershell
[string]$Time = "17:00"  # เปลี่ยนเป็นเวลาที่ต้องการ
```

#### เปลี่ยนจำนวนไฟล์ backup ที่เก็บไว้
แก้ไขในไฟล์ `backup-database.bat`:
```batch
set MAX_BACKUPS=7  # เปลี่ยนเป็นจำนวนที่ต้องการ
```

#### เปลี่ยนข้อมูลการเชื่อมต่อฐานข้อมูล
แก้ไขในไฟล์ `backup-database.bat`:
```batch
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=chi_brows_stores
set DB_USER=root
set DB_PASSWORD=root
```

## การลบ Scheduled Task

หากต้องการลบ scheduled task:
```powershell
Unregister-ScheduledTask -TaskName "Chi-Brows-DB-Backup" -Confirm:$false
```

## การ Restore ข้อมูล

### การ Restore ฐานข้อมูล

1. แตกไฟล์ ZIP backup ที่ต้องการจากโฟลเดอร์ `backups/`

2. หาไฟล์ SQL ภายในโฟลเดอร์ที่แตกออกมา

3. ใช้คำสั่งเพื่อ restore ฐานข้อมูล:
   ```bash
   docker exec -i chi-brows-stores-app-mysql-1 mysql -u root -proot chi_brows_stores < path/to/extracted/chi_brows_stores_backup_YYYY-MM-DD_HH-MM-SS.sql
   ```

### การ Restore ไฟล์ Public

1. แตกไฟล์ ZIP backup ที่ต้องการ

2. Copy โฟลเดอร์ `public_YYYY-MM-DD_HH-MM-SS` กลับไปยัง `server/public`:
   ```bash
   # Backup โฟลเดอร์เดิมก่อน (ถ้าต้องการ)
   mv server/public server/public_backup_$(date +%Y%m%d_%H%M%S)
   
   # Copy โฟลเดอร์จาก backup
   cp -r path/to/extracted/public_YYYY-MM-DD_HH-MM-SS server/public
   ```

### การ Restore แบบครบครัน

สำหรับการ restore ทั้งฐานข้อมูลและไฟล์ public พร้อมกัน สามารถใช้ PowerShell script:

```powershell
# แตกไฟล์ ZIP
Expand-Archive -Path "backups\chi_brows_stores_complete_backup_YYYY-MM-DD_HH-MM-SS.zip" -DestinationPath "temp_restore"

# Restore ฐานข้อมูล
docker exec -i chi-brows-stores-app-mysql-1 mysql -u root -proot chi_brows_stores < temp_restore\chi_brows_stores_backup_YYYY-MM-DD_HH-MM-SS.sql

# Backup โฟลเดอร์ public เดิม
Move-Item "server\public" "server\public_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Restore โฟลเดอร์ public
Copy-Item "temp_restore\public_YYYY-MM-DD_HH-MM-SS" "server\public" -Recurse

# ลบไฟล์ temp
Remove-Item "temp_restore" -Recurse -Force
```

### การ Restore แบบง่าย (ใช้ Script)

สำหรับความสะดวก คุณสามารถใช้ restore script ที่เตรียมไว้:

```powershell
# Restore ทั้งฐานข้อมูลและไฟล์ public
.\restore-backup.ps1 -BackupFile "backups\chi_brows_stores_complete_backup_2024-01-15_17-00-00.zip"

# Restore เฉพาะฐานข้อมูล
.\restore-backup.ps1 -BackupFile "backups\chi_brows_stores_complete_backup_2024-01-15_17-00-00.zip" -SkipPublic

# Restore เฉพาะไฟล์ public
.\restore-backup.ps1 -BackupFile "backups\chi_brows_stores_complete_backup_2024-01-15_17-00-00.zip" -SkipDatabase

# Force overwrite temporary directory
.\restore-backup.ps1 -BackupFile "backups\chi_brows_stores_complete_backup_2024-01-15_17-00-00.zip" -Force
```

**ฟีเจอร์ของ Restore Script:**
- ✅ ตรวจสอบไฟล์ backup อัตโนมัติ
- ✅ แสดงเนื้อหาของไฟล์ backup ก่อน restore
- ✅ ตรวจสอบการเชื่อมต่อ Docker container
- ✅ สำรองไฟล์เก่าก่อน restore ใหม่
- ✅ รายงานจำนวนไฟล์ที่ restore
- ✅ ทำความสะอาดไฟล์ชั่วคราวอัตโนมัติ

## หมายเหตุความปลอดภัย

- ไฟล์ backup อาจมีข้อมูลสำคัญ ควรเก็บรักษาอย่างปลอดภัย
- ใช้รหัสผ่านที่แข็งแกร่งสำหรับการเข้าถึงฐานข้อมูล
- พิจารณาเข้ารหัสไฟล์ backup หากมีข้อมูลที่ละเอียดอ่อน
- ทดสอบการ restore เป็นประจำเพื่อให้แน่ใจว่าไฟล์ backup ใช้งานได้ 