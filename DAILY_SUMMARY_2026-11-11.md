# สรุปการทำงานและการปรับปรุงระบบ ITSD : ITServiceDesk (วันที่ 11 พฤศจิกายน 2026)

เอกสารสรุปการแก้ไขปรับปรุง Source Code, ฟังก์ชันการทำงาน, ระบบใบงาน (CM-Form_69), การเชื่อมต่อ GitHub/Google Apps Script และงานโครงสร้างพื้นฐานทั้งหมดประจำวันที่ **2026-11-11** (ตั้งแต่เวอร์ชัน `V1.1.53` ถึง `V1.1.68`, รวม **13 Commits** บน `main`)

---

## 1. ภาพรวมเวอร์ชันและ Deployment

- **Repository:** `https://github.com/longzedesign-dotcom/ITServiceDesk.git` (`main`)
- **ช่วงเวอร์ชันที่พัฒนาวันนี้:** `V1.1.53` → **`V1.1.68`** (ปัจจุบัน Deploy ล่าสุดที่ **Apps Script Deployment `@30`**)
- **ไฟล์ Source Code หลักที่ปรับปรุง (และซิงค์ `src/` ↔ root ตรงกัน):**
  - [`src/Server.js`](./src/Server.js) / [`Server.js`](./Server.js)
  - [`src/UI_Client.html`](./src/UI_Client.html) / [`UI_Client.html`](./UI_Client.html)
  - [`src/UI_Styles.html`](./src/UI_Styles.html) / [`UI_Styles.html`](./UI_Styles.html)
  - [`src/Index.html`](./src/Index.html) / [`Index.html`](./Index.html)
  - [`src/Api.js`](./src/Api.js) / [`Api.js`](./Api.js)
  - [`PATCH_NOTES.md`](./PATCH_NOTES.md), [`README.md`](./README.md), [`MANUAL_USER.md`](./MANUAL_USER.md), [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md), [`DATA_DIAGRAM_AND_WORKFLOW.md`](./DATA_DIAGRAM_AND_WORKFLOW.md)

---

## 2. สรุปรายการแก้ไขแยกตามกลุ่มงานและเวอร์ชัน

### กลุ่มที่ 1: ธีมสีและการปรับโครงสร้างทะเบียนครุภัณฑ์ (`V1.1.53` – `V1.1.61`)

1. **`V1.1.53` (`b167212`) — Clay and Sea Complete Theme Overhaul**
   - ปรับชุดสีหลักทั้งระบบเป็นโทน **Clay and Sea** (`#C7522A`, `#E5C185`, `#FBF2C4`, `#74A892`, `#008585`) พร้อมพื้นหลัง Dark Mode/Sidebar (`#061D22`, `#0B2B30`), Light Mode (`#FAF7EE`), และคงปุ่ม Sign out / ออกจากระบบเป็นสีแดง
   - จัดเส้นแบ่ง Header แนวนอนที่ความสูง `68px` ให้เชื่อมต่อเนื่อง

2. **`V1.1.54` (`036a8e7`) & `V1.1.58` (`81dcab4`) — แยกแท็บรายละเอียดและการบันทึกข้อมูลครุภัณฑ์เป็นอิสระ**
   - จัดลำดับแท็บใน [`uiAssetSide()`](./src/UI_Client.html#L671) เป็น: **ข้อมูลทั่วไป → คุณลักษณะ → การสำรวจ → ประวัติแจ้งซ่อม**
   - แยกหน้าต่างและ API การบันทึกอิสระต่อแท็บ:
     - [`assetGeneralForm()`](./src/UI_Client.html#L3069) / [`submitAssetGeneral()`](./src/UI_Client.html#L3088): แก้ไขและบันทึกเฉพาะข้อมูลทั่วไป โดยคงค่าคุณลักษณะเดิมไว้ใน [`itsdImpl_saveInventory_()`](./src/Server.js#L3230)
     - [`assetSpecsForm()`](./src/UI_Client.html#L3135) / [`submitAssetSpecs()`](./src/UI_Client.html#L3149): แก้ไขและบันทึกเฉพาะคุณลักษณะทางเทคนิค 6 ฟิลด์ผ่าน [`saveInventorySpecs_()`](./src/Server.js#L3101)
     - `assetSurveyForm()` / `submitAssetSurvey()`: แก้ไขและบันทึกผลสำรวจผ่าน [`saveInventorySurvey_()`](./src/Server.js#L3049)

3. **`V1.1.59` (`d5707a3`) — รวมชื่อระบบ เอกสาร และการเชื่อมต่อโครงสร้าง Drive / GitHub**
   - ปรับ Header ของ Source Code ทุกไฟล์เป็น `ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)` และซิงค์โฟลเดอร์ Google Drive กับ `DBS_ITSD`
   - เชื่อมต่อ Repository และ Push Source Code ทั้งหมดขึ้น GitHub (`origin/main`) พร้อมจัดทำคู่มือ/Diagram ครบชุด

4. **`V1.1.60` (`cafea75`) & `V1.1.61` (`a6eff9e`) — ปรับฟอร์มแก้ไขอุปกรณ์ให้กระชับพอดีหน้าเดียวและเรียบง่าย**
   - ปรับขนาด Modal (`.modal-box:has(.asset-compact-form)` กว้าง `980px`) และจัด Grid 4 คอลัมน์ / 3 คอลัมน์ให้อยู่ในหน้าเดียวโดยไม่ต้องเลื่อน Scroll บน Desktop
   - Refactor ด้วย Shared Helpers: [`assetSectionHtml_()`](./src/UI_Client.html#L3013), [`assetGeneralSectionsHtml_()`](./src/UI_Client.html#L3017), [`assetSpecsSectionHtml_()`](./src/UI_Client.html#L3053), [`bindAssetEditorDirty_()`](./src/UI_Client.html#L3059)
   - ถอดกรอบ Card และสีพื้นหลังย่อยออกจาก `.asset-compact-section` ใช้หัวข้อตัวหนาขนาดใหญ่แบ่งกลุ่มแทน

---

### กลุ่มที่ 2: แม่แบบใบงานบริการ CM-Form_69 และการเชื่อมโยงข้อมูล (`V1.1.62`, `V1.1.65`, `V1.1.66`, `V1.1.67`)

1. **`V1.1.62` (`777c6ef`) — จัดหน้าแม่แบบใบงานบริการ A4 เหมือน `CM-Form_69.pdf` 100%**
   - ฟังก์ชันเรนเดอร์ใบงาน [`service70Html()`](./src/UI_Client.html#L6793): โลโก้ Open Technology เป็นค่าเริ่มต้น, หัวข้อสีน้ำเงิน, กรอบ `SERVICE REPORT`, Checkbox ประเภทอุปกรณ์ 5 ประเภท, เส้นประช่อง `ปัญหา` (3 บรรทัด) และ `วิธีการแก้ไข` (4 บรรทัด), ตาราง `สถานะของงาน`, `อุปกรณ์ส่งซ่อม` / `อุปกรณ์ทดแทน`, `หมายเหตุ` และช่องลงนามสมมาตร
   - หลังเจ้าหน้าที่เปลี่ยนสถานะงานเป็น `รอยืนยันผล` ระบบเปิด [`service70Edit()`](./src/UI_Client.html#L6993) ให้อัตโนมัติ พร้อมบันทึก/ดึงข้อมูลผ่าน [`itsdImpl_getServiceReport_()`](./src/Server.js#L10278) และ [`itsdImpl_saveServiceReportDetails_()`](./src/Server.js#L10337)
   - เพิ่มหน้าจัดการโลโก้และตัวอย่าง A4 เรียลไทม์ใน Settings ([`itsdImpl_uploadServiceReportLogo_()`](./src/Server.js#L10155), [`itsdImpl_clearServiceReportLogo_()`](./src/Server.js#L10200), [`project70ReportSampleData()`](./src/UI_Client.html#L6607), [`project70UpdateReportPreview()`](./src/UI_Client.html#L6658))

2. **`V1.1.65` (`13faf21`) — ปรับขอบกระดาษ 1 cm, `JOB NO.` ครบหลัก และชื่อหน่วยงานบรรทัดเดียว**
   - ตั้ง `@page{size:A4 portrait;margin:10mm}` และ `.sheet{max-width:190mm}` (ขอบซ้าย-ขวาข้างละ 1 cm) พร้อมซิงค์ `@media screen` และ `@media print`
   - ปรับ `.head-top` และ `.job-no` (`white-space:nowrap`, `overflow-wrap:normal`) ให้เลขใบงานยาวเช่น `INC-2027-11-11-0002` แสดงครบทุกหลักไม่ขาดขอบ
   - เพิ่มตัวช่วย `baseLen()` และ `orgField()` คำนวณขนาดตัวอักษรอัตโนมัติในแถว `.org-row` ทำให้ชื่อ `สำนัก/กอง` และ `กลุ่ม/ศูนย์` ยาวแสดงครบสมบูรณ์ใน 1 บรรทัด

3. **`V1.1.66` (`97bb94b`) — ปรับปุ่มหน้าต่างใบงาน CM และสัดส่วนช่อง `โทร.` / `ชั้น`**
   - ในหน้าต่าง [`service70Edit()`](./src/UI_Client.html#L6993): ตัดปุ่ม `บันทึก & พิมพ์ใบงาน (PDF)` (และตัวจัดการ `#service70SaveAndPrint`) ออก แล้วจัดลำดับปุ่มใหม่เป็น **`บันทึก`** → **`พิมพ์ใบงาน (PDF)`**
   - ในแบบฟอร์ม PDF [`service70Html()`](./src/UI_Client.html#L6793): เปลี่ยนข้อความ `โทรศัพท์ภายใน` เป็น **`โทร.`** และลดความกว้างช่อง `ชั้น` ลง 50% (`0.62fr` → `0.31fr`) เพื่อนำพื้นที่มาเพิ่มให้ช่อง `โทร.` (`1fr` → `1.31fr`)

4. **`V1.1.67` (`045a2e7`) — ขยับตำแหน่ง `โทร.` ไปด้านขวา ~6 ตัวอักษร**
   - ปรับสัดส่วนแถว `.r4` ใน [`service70Html()`](./src/UI_Client.html#L6793) จาก `1.45fr 1.31fr .31fr .95fr` เป็น **`1.71fr 1.05fr .31fr .95fr`** เพื่อเพิ่มพื้นที่ช่อง `ชื่อผู้ใช้งาน` และเลื่อนตำแหน่ง **`โทร.`** ไปทางด้านขวาประมาณ 6 ตัวอักษร

---

### กลุ่มที่ 3: Workflow แจ้งซ่อม LINE, การค้นหา/แก้ไขครุภัณฑ์ และรหัสอุปกรณ์อัตโนมัติ (`V1.1.63`, `V1.1.64`, `V1.1.68`)

1. **`V1.1.63` (`535400d`) — ส่งข้อมูลจาก LINE Inbox เข้าฟอร์ม `แจ้งซ่อมใหม่`**
   - ปรับ [`line78Decision()`](./src/UI_Client.html#L9302) และเพิ่ม [`line78PrefillTicketForm()`](./src/UI_Client.html#L9222) เมื่อกด `อนุมัติแจ้งซ่อม` ให้ส่งข้อมูลทั้งหมดเข้าฟอร์ม `#ticketForm` ด้านซ้าย เพื่อให้ตรวจสอบ กรอกส่วนที่ขาด และกด `บันทึกคำขอ` ตามขั้นตอน โดยไม่ข้ามไปหน้า `ติดตามงาน`
   - ปรับ [`itsdImpl_createTicket_()`](./src/Server.js#L2531) ให้เชื่อม `line_inbox_id` และอัปเดตสถานะ `LINE_INBOX` เป็น `CREATED` พร้อมกันภายใน `lock_()`

2. **`V1.1.64` (`28df908`) — ค้นหาครุภัณฑ์/ซีเรียลจาก Inventory และแก้ไขข้อมูลอุปกรณ์ได้**
   - เพิ่ม Shared Helper [`uiAttachInventoryPicker()`](./src/UI_Client.html#L3361) สำหรับค้นหาอุปกรณ์ด้วย **เลขครุภัณฑ์ หรือ หมายเลขซีเรียล** จาก `INVENTORY`
   - เชื่อมใช้งานทั้งในหน้า **`อัปเดตสถานะ`** (`statusForm`) และหน้า **`สร้าง / แก้ไขข้อมูลใบงาน (CM)`** ([`service70Edit()`](./src/UI_Client.html#L6993)) ทั้งส่วนครุภัณฑ์หลักของงาน, `อุปกรณ์ส่งซ่อม` (พร้อมปุ่ม `ใช้เครื่องเดียวกับงานนี้`) และ `อุปกรณ์ทดแทน`
   - ฝั่ง Server เพิ่ม [`ticketApplyDevicePatch_()`](./src/Server.js#L2662) ใช้ร่วมกันใน [`itsdImpl_changeStatus_()`](./src/Server.js#L2698) และ [`itsdImpl_saveServiceReportDetails_()`](./src/Server.js#L10337)

3. **`V1.1.68` (`a027663`) — สร้างรหัสอุปกรณ์อัตโนมัติต่อท้ายเลขล่าสุด (`INV-TOR70-1651` → `INV-TOR70-1652`)**
   - ฝั่ง Server เพิ่ม [`nextInventoryId_()`](./src/Server.js#L3192) และเรียกใช้แทนรหัสสุ่ม UUID ใน [`itsdImpl_saveInventory_()`](./src/Server.js#L3230) โดยอ่านรหัสอุปกรณ์ล่าสุดจากชีต `INVENTORY` (ข้ามรหัส UUID เก่า `INV-XXXXXXXX` หากมีปนอยู่) แล้วเพิ่มเลขลำดับสูงสุดของ Prefix นั้น + 1 ภายใต้ `lock_()`
   - ฝั่ง Client เพิ่ม [`inventoryNextIdPreview_()`](./src/UI_Client.html#L3182) แสดงตัวอย่างรหัสใหม่บนหัวหน้าต่าง [`assetForm()`](./src/UI_Client.html#L3217) และให้ [`submitAsset()`](./src/UI_Client.html#L3307) รับ `savedId` จาก Server มาเลือกและแจ้งผลใน Toast ทันที

---

## 3. งานติดตั้งเครื่องมือเสริม (Global Antigravity Skills)

นอกเหนือจาก Source Code ของโปรเจกต์ `ITSD` ได้ดำเนินการติดตั้งชุดสกิลเสริมสำหรับ Antigravity ลงใน Global Discovery (`/Users/chaloem/.gemini/config/skills/`):
- จาก `https://github.com/omer-metin/skills-for-antigravity.git`: ติดตั้งใหม่ **460** สกิล
- จาก `https://github.com/rmyndharis/antigravity-skills.git`: ติดตั้งเพิ่มใหม่ **296** สกิล (จากทั้งหมด 307 สกิล, คงสกิลชื่อซ้ำเดิมไว้ 11 สกิลโดยไม่เขียนทับ)
- รวม Global Skills ที่พร้อมใช้งานทั้งหมดในเครื่อง: **757** สกิล (ตรวจ `SKILL.md` ครบทุกโฟลเดอร์)
