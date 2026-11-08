// CreateIssue.gs
// ==================== REPAIR ISSUE CREATION SERVICE ====================

/**
 * Creates a new repair ticket (issue)
 */
function addRepair(repairData) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Ticket_ID', 'Asset_ID', 'ชื่อพัสดุ/เลขครุภัณฑ์', 'ประเภทพัสดุ', 'รายละเอียดปัญหา', 
        'ระดับความเร่งด่วน', 'ช่างผู้รับผิดชอบ', 'วันที่แจ้ง', 'วันที่เริ่มซ่อม', 'วันที่เสร็จสิ้น', 
        'สถานะการซ่อม', 'ค่าใช้จ่าย', 'หมายเหตุ', 'ผู้แจ้ง', 'วันที่สร้าง'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(sheet, headers.length);
    }
    
    // Generate repair ID
    const newId = generateAutoRepairId(sheet);
    const dateNow = getFormattedDateTime();
    const problemDescription = repairData.problemDescription || repairData.problem || '-';

    // จัดเรียง Array ให้ตรงกับโครงสร้างคอลัมน์ของแท็บ Ticket_Incident
    const rowData = [
      newId,                                // คอลัมน์ A: Ticket_ID
      repairData.assetId || '',             // คอลัมน์ B: Asset_ID
      repairData.assetName || repairData.assetCode || '-', // คอลัมน์ C: ชื่อพัสดุ
      repairData.type || '-',               // คอลัมน์ D: ประเภทพัสดุ
      problemDescription,                   // คอลัมน์ E: รายละเอียดปัญหา
      repairData.priority || 'ปานกลาง',     // คอลัมน์ F: ระดับความเร่งด่วน
      '',                                   // คอลัมน์ G: ช่างผู้รับผิดชอบ (ปล่อยว่างรออนุมัติ)
      dateNow,                              // คอลัมน์ H: วันที่แจ้ง
      '',                                   // คอลัมน์ I: วันที่เริ่มซ่อม
      '',                                   // คอลัมน์ J: วันที่เสร็จสิ้น
      'แจ้งปัญหา',                            // คอลัมน์ K: สถานะการซ่อมเริ่มต้น
      0,                                    // คอลัมน์ L: ค่าใช้จ่าย
      repairData.notes || '',               // คอลัมน์ M: หมายเหตุ
      repairData.reporter || 'ผู้ใช้งานระบบ', // คอลัมน์ N: ผู้แจ้ง
      dateNow                               // คอลัมน์ O: วันที่สร้าง
    ];

    // บันทึกลง Google Sheets
    sheet.appendRow(rowData);
    
    // แนบรูปลงโฟลเดอร์ Google Drive (ถ้ามีการส่งรูปภาพ Base64 มา)
    let imageUrl = '';
    if (repairData.imageBase64) {
      const fileName = `Repair_${newId}_${Date.now()}.png`;
      imageUrl = uploadImageToDrive(repairData.imageBase64, fileName);
    }

    logActivity(repairData.reporter || 'User', 'แจ้งซ่อมใหม่', `แจ้งซ่อมรหัส: ${newId} (พัสดุ: ${repairData.assetId || repairData.assetName})`);
    
    // แจ้งเตือนผ่าน Telegram (ถ้าเปิดไว้)
    const settings = getNotificationSettings();
    if (settings.newRepair) {
      const message = `🚨 <b>มีการแจ้งซ่อมใหม่!</b>\nรหัส: ${newId}\nพัสดุ: ${repairData.assetName || repairData.assetId}\nปัญหา: ${problemDescription}\nความเร่งด่วน: ${repairData.priority || 'ปานกลาง'}\nผู้แจ้ง: ${repairData.reporter || 'ไม่ระบุ'}`;
      sendTelegramMessage(message);
    }

    return { 
      success: true, 
      message: 'บันทึกการแจ้งซ่อมสำเร็จ', 
      data: { id: newId, imageUrl: imageUrl } 
    };
  } catch (error) {
    Logger.log('Error in addRepair: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Uploads Base64 image to Google Drive folder and returns shareable URL
 */
function uploadImageToDrive(base64Data, filename) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const contentType = base64Data.substring(5, base64Data.indexOf(';'));
    const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, filename);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    Logger.log('Error uploading image to drive: ' + e.toString());
    return '';
  }
}

/**
 * Generates an auto-increment repair ID (e.g. 18114, 18115, ...)
 */
function generateAutoRepairId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return '10001';
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const val = parseInt(data[i][0]) || 0;
    if (val > maxId) maxId = val;
  }
  return String(maxId + 1);
}
