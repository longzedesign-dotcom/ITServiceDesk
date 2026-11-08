// Backup.gs
// ==================== DATABASE BACKUP FUNCTIONS ====================

/**
 * สำรองข้อมูลฐานข้อมูล Google Sheets ไปยังโฟลเดอร์ Google Drive
 */
function backupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const dateStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd_HHmmss");
    const backupName = `Backup_${spreadsheet.getName()}_${dateStr}`;
    
    // สร้างสำเนาของ Spreadsheet
    const backupFile = DriveApp.getFileById(CONFIG.SPREADSHEET_ID).makeCopy(backupName, folder);
    
    logActivity('System', 'สำรองข้อมูล', `สำรองข้อมูลสำเร็จ: ${backupName}`);
    return { success: true, message: `สำรองข้อมูลสำเร็จ: ${backupName}`, backupId: backupFile.getId() };
  } catch (e) {
    Logger.log('Error in backupSpreadsheet: ' + e.toString());
    return { success: false, message: 'เกิดข้อผิดพลาดในการสำรองข้อมูล: ' + e.toString() };
  }
}

/**
 * ตั้งค่า Trigger สำรองข้อมูลอัตโนมัติทุกวันเวลา 01:00
 */
function setupBackupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'backupSpreadsheet') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('backupSpreadsheet')
    .timeBased()
    .everyDays(1)
    .atHour(1)
    .create();

  return { success: true, message: 'ตั้งค่าการสำรองข้อมูลอัตโนมัติสำเร็จ' };
}
