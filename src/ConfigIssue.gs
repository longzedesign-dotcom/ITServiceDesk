// ConfigIssue.gs
// ==================== ISSUE CONFIGURATION & TIMERS ====================

/**
 * Gets the current notification settings
 */
function getNotificationSettings() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.SETTINGS);
    if (sheet.getLastRow() <= 0) {
      sheet.getRange(1, 1, 1, 3).setValues([[
        'แจ้งเตือนเมื่อมีรายการซ่อมใหม่',
        'แจ้งเตือนเมื่อซ่อมเสร็จสิ้น',
        'แจ้งเตือนเมื่อเกินกำหนดเวลา'
      ]]);
      sheet.getRange(2, 1, 1, 3).setValues([[true, true, true]]);
      formatHeaders(sheet, 3);
    }
    const settings = sheet.getRange(2, 1, 1, 3).getValues()[0];
    return {
      newRepair: settings[0] === true,
      completedRepair: settings[1] === true,
      overdueRepair: settings[2] === true
    };
  } catch (e) {
    Logger.log('Error getting notification settings: ' + e.toString());
    return { newRepair: false, completedRepair: false, overdueRepair: false };
  }
}

/**
 * Updates notification settings
 */
function updateNotificationSettings(settings) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.SETTINGS);
    sheet.getRange(2, 1, 1, 3).setValues([[
      settings.newRepair || false,
      settings.completedRepair || false,
      settings.overdueRepair || false
    ]]);
    logActivity('Admin', 'อัพเดทการตั้งค่าแจ้งเตือน', `ตั้งค่า: ${JSON.stringify(settings)}`);
    return { success: true, message: 'อัพเดทการตั้งค่าแจ้งเตือนสำเร็จ' };
  } catch (e) {
    Logger.log('Error updating notification settings: ' + e.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + e.toString() };
  }
}

/**
 * Triggers daily check of overdue repairs and notifies via Telegram
 */
function checkOverdueRepairs() {
  try {
    const settings = getNotificationSettings();
    if (!settings.overdueRepair) return;

    const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    const data = sheet.getDataRange().getValues();
    const now = new Date();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const repairId = row[0];
      const status = String(row[10] || '').trim();
      const reportDate = row[7] ? new Date(row[7]) : null;
      const priority = row[5];

      if ((status !== 'รอดำเนินการ' && status !== 'แจ้งปัญหา' && status !== 'New') || !reportDate || isNaN(reportDate.getTime())) continue;

      let maxDays = 7;
      if (priority === 'สูง') maxDays = 2;
      else if (priority === 'ปานกลาง') maxDays = 5;

      const daysSinceReport = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
      if (daysSinceReport > maxDays) {
        const message = `⚠️ <b>แจ้งเตือนการซ่อมเกินกำหนด</b>\nรหัสซ่อม: ${repairId}\nชื่อพัสดุ: ${row[2]}\nวันที่แจ้ง: ${formatDate(reportDate)}\nเกินกำหนด: ${daysSinceReport - maxDays} วัน`;
        sendTelegramMessage(message);
      }
    }
  } catch (e) {
    Logger.log('Error in checkOverdueRepairs: ' + e.toString());
  }
}

/**
 * Sets up Apps Script triggers for system jobs
 */
function setupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('checkOverdueRepairs')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
}

/**
 * Full system initial setup
 */
function setupSystem() {
  try {
    mainFolder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    mainSpreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    initializeSystem();
    setupTriggers();
    setupBackupTrigger();
    Logger.log('System setup completed successfully');
  } catch (e) {
    Logger.log('Error in system setup: ' + e.toString());
  }
}

/**
 * Validates whether string is a valid date
 */
function validateDate(dateStr) {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Ensures system sheets exist and are properly formatted
 */
function initializeSystem() {
  try {
    // 1. Settings Sheet
    const settingsSheet = getOrCreateSheet(CONFIG.SHEETS.SETTINGS);
    if (settingsSheet.getLastRow() <= 0) {
      settingsSheet.getRange(1, 1, 1, 3).setValues([[
        'แจ้งเตือนเมื่อมีรายการซ่อมใหม่',
        'แจ้งเตือนเมื่อซ่อมเสร็จสิ้น',
        'แจ้งเตือนเมื่อเกินกำหนดเวลา'
      ]]);
      settingsSheet.getRange(2, 1, 1, 3).setValues([[true, true, true]]);
      formatHeaders(settingsSheet, 3);
    }

    // 2. Categories Sheet (Master_Reference)
    const catSheet = getOrCreateSheet(CONFIG.SHEETS.CATEGORIES);
    if (catSheet.getLastRow() <= 0) {
      catSheet.getRange(1, 1, 1, 4).setValues([['Reference_ID', 'Device_Type', 'Brand', 'Model']]);
      formatHeaders(catSheet, 4);
    }

    // 3. Assets Sheet
    const assetsSheet = getOrCreateSheet(CONFIG.SHEETS.ASSETS);
    if (assetsSheet.getLastRow() <= 0) {
      const headers = [
        'Asset_ID', 'Asset_Tag', 'Asset_Number', 'Device_Type', 'Brand', 'Model', 
        'Serial_Number', 'Fiscal_Year', 'Project_Name', 'Receive_Date', 'Warranty_Period', 
        'Warranty_End_Date', 'Vendor', 'Owner_Department', 'Location', 'Bureau', 
        'Section', 'Assigned_User', 'Status', 'Remarks'
      ];
      assetsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(assetsSheet, headers.length);
    }

    // 4. Repairs Sheet (Ticket_Incident)
    const repairsSheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    if (repairsSheet.getLastRow() <= 0) {
      const headers = [
        'Ticket_ID', 'Asset_ID', 'ชื่อพัสดุ/เลขครุภัณฑ์', 'ประเภทพัสดุ', 'รายละเอียดปัญหา', 
        'ระดับความเร่งด่วน', 'ช่างผู้รับผิดชอบ', 'วันที่แจ้ง', 'วันที่เริ่มซ่อม', 'วันที่เสร็จสิ้น', 
        'สถานะการซ่อม', 'ค่าใช้จ่าย', 'หมายเหตุ', 'ผู้แจ้ง', 'วันที่สร้าง'
      ];
      repairsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(repairsSheet, headers.length);
    }

    // 5. Costs Sheet
    const costsSheet = getOrCreateSheet(CONFIG.SHEETS.COSTS);
    if (costsSheet.getLastRow() <= 0) {
      const headers = ['รหัสค่าใช้จ่าย', 'รหัสซ่อม', 'รหัสพัสดุ', 'รายการ', 'จำนวน', 'ราคาต่อหน่วย', 'ราคารวม', 'วันที่', 'ประเภท', 'ผู้อนุมัติ', 'หมายเหตุ'];
      costsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(costsSheet, headers.length);
    }

    // 6. Logs Sheet
    const logsSheet = getOrCreateSheet(CONFIG.SHEETS.LOGS);
    if (logsSheet.getLastRow() <= 0) {
      logsSheet.getRange(1, 1, 1, 4).setValues([['วันที่-เวลา', 'ผู้ใช้งาน', 'การกระทำ', 'รายละเอียด']]);
      formatHeaders(logsSheet, 4);
    }

    // 7. Users Sheet
    const usersSheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    if (usersSheet.getLastRow() <= 0) {
      const userHeaders = [
        'User_id', 'Username', 'Password_Hash', 'Salt', 'Full_name', 'Email', 
        'Phone_number', 'Department', 'Role', 'Status', 'Registration_date', 
        'Last_login', 'Failed_attempts', 'Lockout_until', 'Reset_token', 'Reset_token_expires', 'Picture', 'LINE User ID'
      ];
      usersSheet.getRange(1, 1, 1, userHeaders.length).setValues([userHeaders]);
      formatHeaders(usersSheet, userHeaders.length);
    }

    return { success: true, message: 'ตรวจสอบและจัดเตรียมโครงสร้างฐานข้อมูลเรียบร้อยแล้ว' };
  } catch (error) {
    Logger.log('Error initializing system: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
