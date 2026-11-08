// Notification.gs
// ==================== TELEGRAM NOTIFICATION SYSTEM ====================

/**
 * Sends a message payload to Telegram via Bot API
 */
function sendTelegramMessage(message) {
  try {
    if (!CONFIG.TELEGRAM.BOT_TOKEN || !CONFIG.TELEGRAM.CHAT_ID) {
      Logger.log('Telegram bot token or chat ID is not configured. Skipping notification.');
      return { success: false, message: 'ไม่ได้กำหนดค่า Telegram Token/Chat ID' };
    }
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM.BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: CONFIG.TELEGRAM.CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    };
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    const res = UrlFetchApp.fetch(url, options);
    return { success: true, message: 'ส่งข้อความ Telegram สำเร็จ', response: res.getContentText() };
  } catch (e) {
    Logger.log('Error sending Telegram message: ' + e.toString());
    return { success: false, message: 'เกิดข้อผิดพลาดในการส่ง Telegram: ' + e.toString() };
  }
}
