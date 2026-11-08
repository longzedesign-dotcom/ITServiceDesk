// Logger.gs
// ==================== SYSTEM AUDIT LOGGING ====================

/**
 * บันทึก Audit Log กิจกรรมการใช้งานระบบลงชีต SystemLog
 */
function logActivity(user, action, details) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.LOGS);
    const now = getFormattedDateTime();
    sheet.appendRow([now, user, action, details, '', '']);
  } catch (e) {
    Logger.log("Error in logActivity: " + e.toString());
  }
}
