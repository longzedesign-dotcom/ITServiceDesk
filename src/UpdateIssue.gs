// UpdateIssue.gs
// ==================== REPAIR ISSUE UPDATE SERVICE ====================

/**
 * Updates a repair ticket details
 */
function updateRepair(repairData) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(repairData.id)) {
        const row = i + 1;
        
        // อัปเดตข้อมูลให้ตรงกับคอลัมน์ของ Ticket_Incident (1 = A, 2 = B, ...)
        if (repairData.assetId) sheet.getRange(row, 2).setValue(repairData.assetId); // คอลัมน์ B: Asset_ID
        if (repairData.assetName) sheet.getRange(row, 3).setValue(repairData.assetName); // คอลัมน์ C: ชื่อพัสดุ
        if (repairData.type) sheet.getRange(row, 4).setValue(repairData.type);       // คอลัมน์ D: ประเภทพัสดุ
        if (repairData.problem) sheet.getRange(row, 5).setValue(repairData.problem); // คอลัมน์ E: ปัญหา
        if (repairData.priority) sheet.getRange(row, 6).setValue(repairData.priority); // คอลัมน์ F: ความเร่งด่วน
        if (repairData.technician) sheet.getRange(row, 7).setValue(repairData.technician); // คอลัมน์ G: ช่าง
        if (repairData.status) sheet.getRange(row, 11).setValue(repairData.status);  // คอลัมน์ K: สถานะ
        
        if (repairData.cost !== undefined) {
          sheet.getRange(row, 12).setValue(parseFloat(repairData.cost) || 0);       // คอลัมน์ L: ค่าใช้จ่าย
        }
        if (repairData.notes !== undefined) {
          sheet.getRange(row, 13).setValue(repairData.notes);                       // คอลัมน์ M: หมายเหตุ
        }
        
        // ถ้าสถานะเป็นเสร็จสิ้น ให้บันทึกวันที่เสร็จสิ้นและบันทึกค่าใช้จ่าย
        if (repairData.status === 'เสร็จสิ้น' || repairData.status === 'Closed') {
          sheet.getRange(row, 10).setValue(getFormattedDateTime()); // คอลัมน์ J: วันที่เสร็จสิ้น
          
          if (parseFloat(repairData.cost) > 0) {
            addCostFromRepair(repairData.id);
          }
          
          const settings = getNotificationSettings();
          if (settings.completedRepair) {
            sendTelegramMessage(`✅ <b>ซ่อมเสร็จสิ้นแล้ว!</b>\nรหัส: ${repairData.id}\nช่าง: ${repairData.technician || '-'}\nสถานะ: พร้อมใช้งาน`);
          }
        }
        
        logActivity('Admin', 'แก้ไขข้อมูลแจ้งซ่อม', `อัปเดตสถานะรหัส ${repairData.id} เป็น ${repairData.status}`);
        return { success: true, message: 'อัปเดตข้อมูลสำเร็จ' };
      }
    }
    return { success: false, message: 'ไม่พบรหัสการแจ้งซ่อมที่ต้องการแก้ไข' };
  } catch (error) {
    Logger.log('Error in updateRepair: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Automatically records cost entry from completed repair
 */
function addCostFromRepair(repairId) {
  try {
    const repairsSheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    const costsSheet = getOrCreateSheet(CONFIG.SHEETS.COSTS);
    const repairs = repairsSheet.getDataRange().getValues();
    
    for (let i = 1; i < repairs.length; i++) {
      if (String(repairs[i][0]) === String(repairId)) {
        const repair = repairs[i];
        const cost = parseFloat(repair[11]) || 0;
        if (cost <= 0) return;
        
        const costId = 'CST-' + repairId + '-' + Date.now();
        const row = [
          costId,
          repairId,
          repair[1] || '',
          'ค่าซ่อมบำรุง/อะไหล่ (' + (repair[3] || 'ทั่วไป') + ')',
          1,
          cost,
          cost,
          getFormattedDateTime(),
          repair[3] || 'ทั่วไป',
          repair[6] || 'ช่างเทคนิค',
          'บันทึกอัตโนมัติจากการปิดงานซ่อม'
        ];
        costsSheet.appendRow(row);
        break;
      }
    }
  } catch (e) {
    Logger.log('Error in addCostFromRepair: ' + e.toString());
  }
}
