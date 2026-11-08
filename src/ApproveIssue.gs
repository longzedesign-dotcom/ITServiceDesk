// ApproveIssue.gs
// ==================== REPAIR ISSUE APPROVAL SERVICE ====================

function approveRepair(repairId, technicianName) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(repairId)) {
        const row = i + 1;
        
        // อัปเดตข้อมูลลง Ticket_Incident: คอลัมน์ G(7)=ช่าง, K(11)=สถานะ, I(9)=วันที่เริ่มซ่อม
        sheet.getRange(row, 7).setValue(technicianName || 'ช่างเทคนิค');
        sheet.getRange(row, 11).setValue('กำลังซ่อม');
        
        // ถ้ายังไม่มีวันที่เริ่มซ่อม ให้บันทึกเวลาปัจจุบันลงไป
        if (!data[i][8]) {
          sheet.getRange(row, 9).setValue(getFormattedDateTime());
        }
        
        logActivity('Admin', 'อนุมัติงานซ่อม', `อนุมัติรับซ่อมรหัส: ${repairId} (ช่าง: ${technicianName})`);
        
        const settings = getNotificationSettings();
        if (settings.newRepair) {
          const message = `🛠️ <b>อนุมัติรับซ่อมแล้ว</b>\nรหัสซ่อม: ${repairId}\nชื่อพัสดุ: ${data[i][2]}\nช่างผู้รับผิดชอบ: ${technicianName || 'ช่างเทคนิค'}\nเริ่มดำเนินการซ่อม...`;
          sendTelegramMessage(message);
        }
        
        return { success: true, message: 'อนุมัติงานซ่อมสำเร็จ' };
      }
    }
    return { success: false, message: 'ไม่พบรหัสซ่อมนี้' };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
