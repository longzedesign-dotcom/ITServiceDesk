# 🛠️ คู่มือการติดตั้งและตั้งค่าระบบ (Installation Guide)
### ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)

คู่มือนี้จัดทำขึ้นเพื่อให้ผู้ดูแลระบบ (System Administrator) และนักพัฒนา สามารถติดตั้งและตั้งค่าระบบ ITSD ได้อย่างถูกต้อง สมบูรณ์ และพร้อมเปิดใช้งานจริง 100%

---

## 📋 สารบัญ
1. [สิ่งที่ต้องเตรียมล่วงหน้า (Prerequisites)](#1-สิ่งที่ต้องเตรียมล่วงหน้า-prerequisites)
2. [วิธีที่ 1: การติดตั้งผ่าน Clasp CLI (แนะนำสำหรับนักพัฒนา)](#2-วิธีที่-1-การติดตั้งผ่าน-clasp-cli-แนะนำสำหรับนักพัฒนา)
3. [วิธีที่ 2: การติดตั้งผ่าน Google Apps Script Editor (ผ่าน Web Browser)](#3-วิธีที่-2-การติดตั้งผ่าน-google-apps-script-editor-ผ่าน-web-browser)
4. [การสั่งรันคำสั่งเริ่มต้นระบบ (Initial System Setup)](#4-การสั่งรันคำสั่งเริ่มต้นระบบ-initial-system-setup)
5. [การ Deploy เป็น Web App Production](#5-การ-deploy-เป็น-web-app-production)
6. [การตั้งค่าระบบแจ้งเตือน Telegram Bot (Optional)](#6-การตั้งค่าระบบแจ้งเตือน-telegram-bot-optional)
7. [การตั้งค่าระบบสำรองข้อมูลอัตโนมัติ (Automatic Backup)](#7-การตั้งค่าระบบสำรองข้อมูลอัตโนมัติ-automatic-backup)
8. [การตรวจสอบและแก้ไขปัญหาที่พบบ่อย (Troubleshooting)](#8-การตรวจสอบและแก้ไขปัญหาที่พบบ่อย-troubleshooting)

---

## 1. สิ่งที่ต้องเตรียมล่วงหน้า (Prerequisites)

ก่อนเริ่มการติดตั้ง ให้เตรียมทรัพยากรบน Google Workspace ดังต่อไปนี้:

1. **Google Spreadsheet ID**:  
   - ไฟล์ฐานข้อมูลหลักชื่อ `DBS_ITSD`
   - URL: `https://docs.google.com/spreadsheets/d/1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs/edit`
   - **ID**: `1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs`
2. **Google Drive Folder ID (สำหรับจัดเก็บรูปภาพและเอกสารแนบ)**:  
   - โฟลเดอร์ชื่อ `pic_itcare` (อยู่ภายในโฟลเดอร์โครงการ ITSD)
   - URL: `https://drive.google.com/drive/folders/15w-DCPUL09HetfwsVzaWo6-5lxUH3xqZ`
   - **ID**: `15w-DCPUL09HetfwsVzaWo6-5lxUH3xqZ`
3. **Google Apps Script Project**:  
   - โครงการ Apps Script ชื่อ `ITServiceDesk`
   - **Script ID**: `1G24xkTApOioEWGknDyVxqQ-sNzICsG8HQoP-5IkfJK98sfGsir_0QWcg`

---

## 2. วิธีที่ 1: การติดตั้งผ่าน Clasp CLI (แนะนำสำหรับนักพัฒนา)

### ขั้นตอนที่ 2.1: ตรวจสอบและติดตั้ง Clasp
```bash
npm install -g @google/clasp
clasp -v
```

### ขั้นตอนที่ 2.2: เข้าสู่ระบบ Google
```bash
clasp login
```

### ขั้นตอนที่ 2.3: ตรวจสอบไฟล์ `.clasp.json`
ตรวจสอบให้มั่นใจว่าไฟล์ `.clasp.json` ที่ Root Directory มีการชี้ไปยัง Script ID และ Root Directory ที่ถูกต้อง:
```json
{
  "scriptId": "1G24xkTApOioEWGknDyVxqQ-sNzICsG8HQoP-5IkfJK98sfGsir_0QWcg",
  "rootDir": "src"
}
```

### ขั้นตอนที่ 2.4: สั่ง Push โค้ดทั้งหมดขึ้น Google Apps Script
```bash
clasp push --force
```

### ขั้นตอนที่ 2.5: สั่ง Deploy Web App
```bash
clasp deploy --description "v1.0.0 Deployment"
```

---

## 3. วิธีที่ 2: การติดตั้งผ่าน Google Apps Script Editor (ผ่าน Web Browser)

หากไม่สะดวกใช้งาน Command Line สามารถติดตั้งผ่านหน้าเว็บเบราว์เซอร์ได้โดยตรง:

1. เปิดเบราว์เซอร์แล้วเข้าไปที่โครงการ Google Apps Script:  
   [https://script.google.com/home/projects/1G24xkTApOioEWGknDyVxqQ-sNzICsG8HQoP-5IkfJK98sfGsir_0QWcg/edit](https://script.google.com/home/projects/1G24xkTApOioEWGknDyVxqQ-sNzICsG8HQoP-5IkfJK98sfGsir_0QWcg/edit)
2. ไปที่เมนู **การตั้งค่าโครงการ (Project Settings)** ⚙️ ด้านซ้ายมือ  
   - ติ๊กถูกที่ช่อง **"แสดงไฟล์ Manifest "appsscript.json" ในตัวแก้ไข"**
3. กลับไปที่ **ตัวแก้ไข (Editor)** `<>`:
   - เปิดไฟล์ `appsscript.json` แล้วแทนที่ด้วยเนื้อหาใน `src/appsscript.json`
4. สร้างไฟล์ Script (`.gs`) และไฟล์ HTML (`.html`) ในโครงการให้ครบทั้ง 18 ไฟล์ตามรายชื่อในโฟลเดอร์ `src/`
5. นำเนื้อหาโค้ดจากแต่ละไฟล์ไปวางลงในไฟล์ที่สร้างขึ้นให้ตรงกัน
6. กดปุ่ม **บันทึก (Save)** 💾

---

## 4. การสั่งรันคำสั่งเริ่มต้นระบบ (Initial System Setup)

หลังจากวางโค้ดใน Apps Script ครบถ้วนแล้ว:

1. ในหน้าตัวแก้ไข ให้เลือกไฟล์ `ConfigIssue.gs`
2. ที่แถบเครื่องมือด้านบน เลือกฟังก์ชัน **`setupSystem`**
3. กดปุ่ม **เรียกใช้ (Run)** ▶️
4. ระบบจะแสดงหน้าต่างขอสิทธิ์การเข้าถึง (Authorization Required):
   - คลิก **ตรวจสอบสิทธิ์ (Review Permissions)**
   - เลือกบัญชี Google ของท่าน
   - หากขึ้นหน้าต่างเตือน ให้คลิก **ขั้นสูง (Advanced)** แล้วคลิก **ไปยัง ITServiceDesk (ไม่ปลอดภัย)**
   - คลิก **อนุญาต (Allow)**
5. ฟังก์ชัน `setupSystem` จะดำเนินการ:
   - ตรวจสอบความถูกต้องของตารางฐานข้อมูลทั้ง 11 ชีต
   - ตั้งค่า Time-driven Trigger ตรวจสอบงานซ่อมเกินกำหนด (Overdue) ทุกวันเวลา 08:00
   - ตั้งค่า Trigger สำรองข้อมูลอัตโนมัติ (Database Backup) ทุกวันเวลา 01:00

---

## 5. การ Deploy เป็น Web App Production

เพื่อให้ผู้ใช้งานทุกคนสามารถเข้าสู่ระบบผ่านลิงก์ได้:

1. ในหน้า Google Apps Script Editor มุมบนขวา ให้คลิกปุ่ม **ทำให้ใช้งานได้ (Deploy)** ➡️ **การจัดการการทำให้ใช้งานได้ (Manage deployments)**
2. คลิก **แก้ไข (Edit)** หรือคลิกไอคอนเครื่องหมายบวก ➕ เลือก **การทำให้ใช้งานได้ใหม่ (New deployment)**
3. เลือกประเภท: **เว็บแอป (Web app)**
4. ตั้งค่าตัวเลือกดังนี้:
   - **คำอธิบาย (Description)**: `ITSD Production Version`
   - **เรียกใช้ในฐานะ (Execute as)**: `ฉัน (Me - บัญชีเจ้าของระบบ)`
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access)**: `ทุกคน (Anyone)`
5. คลิก **ทำให้ใช้งานได้ (Deploy)**
6. คัดลอก **URL ของเว็บแอป (Web app URL)** เพื่อแจกจ่ายให้ผู้ใช้งานในองค์กร

---

## 6. การตั้งค่าระบบแจ้งเตือน Telegram Bot (Optional)

หากต้องการให้ระบบแจ้งเตือนเข้ากลุ่มแชตของทีมช่างเมื่อมีผู้แจ้งซ่อมใหม่:

1. เปิดแอป Telegram แล้วค้นหาบอต `@BotFather`
2. พิมพ์คำสั่ง `/newbot` แล้วตั้งชื่อบอตตามต้องการ จะได้รับ **Bot API Token**
3. นำบอตเข้ากลุ่ม Telegram ของทีมช่าง
4. ค้นหา Chat ID ของกลุ่ม (สามารถส่งข้อความเข้ากลุ่มแล้วดึง Chat ID ผ่าน API)
5. เปิดไฟล์ `src/Config.gs` แล้วนำค่าไปใส่ในส่วน `CONFIG.TELEGRAM`:
   ```javascript
   TELEGRAM: {
     BOT_TOKEN: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ',
     CHAT_ID: '-1001234567890'
   }
   ```
6. สั่ง Deploy ใหม่ หรือ Push อัปเดตขึ้น Apps Script ระบบจะเริ่มแจ้งเตือนอัตโนมัติทันที

---

## 7. การตั้งค่าระบบสำรองข้อมูลอัตโนมัติ (Automatic Backup)

ระบบมีฟังก์ชัน `backupSpreadsheet()` ที่จะทำสำเนาของ Google Sheets ทั้งไฟล์ไปเก็บไว้ในโฟลเดอร์ Google Drive พร้อมประทับวันที่และเวลาให้อัตโนมัติ:

- หากต้องการทดสอบรันการสำรองข้อมูลด้วยตนเอง สามารถเลือกฟังก์ชัน `backupSpreadsheet` ในตัวแก้ไขแล้วกดปุ่ม **Run**
- ไฟล์สำรองจะถูกบันทึกในรูปแบบ: `Backup_DBS_ITSD_YYYY-MM-DD_HHmmss` ลงในโฟลเดอร์ `pic_itcare`

---

## 8. การตรวจสอบและแก้ไขปัญหาที่พบบ่อย (Troubleshooting)

| อาการที่พบ | สาเหตุ | วิธีแก้ไข |
| :--- | :--- | :--- |
| **เข้าหน้าเว็บแล้วขึ้นว่าไม่ได้รับอนุญาต** | การตั้งค่าสิทธิ์ตอน Deploy Web App ผิดพลาด | ตรวจสอบการ Deploy ว่าตั้งค่า **Who has access** เป็น `Anyone` และ **Execute as** เป็น `Me` หรือไม่ |
| **ล็อกอินไม่สำเร็จ / ไม่พบผู้ใช้** | ข้อมูลผู้ใช้ในตาราง `Users` ยังไม่ได้รับอนุมัติ | เข้า Google Sheets ตาราง `Users` ตรวจสอบสถานะว่าต้องเป็น `ใช้งาน` (หากเป็น `รออนุมัติ` ต้องให้ Admin อนุมัติก่อน) |
| **อัปโหลดรูปภาพใบงานไม่ขึ้น** | สิทธิ์ในโฟลเดอร์ Google Drive ปิดกั้น | ตรวจสอบสิทธิ์ของโฟลเดอร์ `pic_itcare` ให้บัญชีเจ้าของ Script มีสิทธิ์เขียนไฟล์ (Editor) |
| **เซสชันหลุด หรือหน้าขาว** | แคชในเบราว์เซอร์หรือ URL ขาด Token | เปิด URL ใหม่โดยต่อท้ายด้วย `?action=clearcache` เพื่อล้างแคชระบบแล้วเข้าสู่ระบบใหม่อีกครั้ง |

---
<div align="center">
  <sub>คู่มือนี้เป็นส่วนหนึ่งของโครงการ ITSD : ITServiceDesk © 2026</sub>
</div>
