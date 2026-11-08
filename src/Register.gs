// Register.gs
// ==================== USER REGISTRATION SERVICE ====================

/**
 * Registers a new user with secure password hashing
 */
function registerUser(userData) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    const newId = generateAutoUserId(sheet);
    const dateNow = getFormattedDateTime();
    
    // สร้างแถวข้อมูลตามโครงสร้าง 18 คอลัมน์
    const newRow = new Array(18).fill('');
    
    // สร้าง Salt และเข้ารหัสผ่าน
    const salt = generateSalt();
    const passwordHash = computeSHA256(userData.Password, salt);

    newRow[USER_COL.ID - 1] = newId;
    newRow[USER_COL.USERNAME - 1] = (userData.Username || '').trim();
    newRow[USER_COL.PASSWORD_HASH - 1] = passwordHash;
    newRow[USER_COL.SALT - 1] = salt;
    newRow[USER_COL.FULL_NAME - 1] = userData.Full_name || userData.Name || '';
    newRow[USER_COL.EMAIL - 1] = userData.Email || '';
    newRow[USER_COL.PHONE - 1] = userData.Phone_number || userData.Phone || '';
    newRow[USER_COL.DEPARTMENT - 1] = userData.Department || '';
    newRow[USER_COL.ROLE - 1] = userData.Role || 'User'; // บทบาทเริ่มต้น
    newRow[USER_COL.STATUS - 1] = 'รออนุมัติ'; // สถานะเริ่มต้น
    newRow[USER_COL.REGISTRATION_DATE - 1] = dateNow;
    newRow[USER_COL.FAILED_ATTEMPTS - 1] = 0;
    
    sheet.appendRow(newRow);
    logActivity('System', 'ลงทะเบียนผู้ใช้ใหม่', `ผู้ใช้รหัส ${newId} (${userData.Full_name || userData.Username})`);
    return { success: true, message: 'ลงทะเบียนสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ (Admin)' };
  } catch (e) {
    Logger.log('Error in registerUser: ' + e.toString());
    return { success: false, message: e.toString() };
  }
}

/**
 * Helper to generate secure auto-increment user ID (U001, U002, ...)
 */
function generateAutoUserId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'U001';
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const idStr = String(data[i][0] || '');
    if (idStr.startsWith('U')) {
      const num = parseInt(idStr.substring(1)) || 0;
      if (num > maxId) maxId = num;
    }
  }
  return 'U' + String(maxId + 1).padStart(3, '0');
}
