// Approve.gs
// ==================== USER LOGIN & APPROVAL SERVICE ====================

/**
 * Handles secure user authentication
 */
function loginUser(username, password) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    const data = sheet.getDataRange().getValues();
    const uname = String(username || '').trim().toLowerCase();
    
    for (let i = 1; i < data.length; i++) {
      const dbUsername = String(data[i][USER_COL.USERNAME - 1] || '').trim().toLowerCase();
      if (dbUsername === uname) {
        const row = i + 1;
        const status = data[i][USER_COL.STATUS - 1];
        const lockoutUntil = data[i][USER_COL.LOCKOUT_UNTIL - 1];
        
        // 1. Check account lockout status
        if (lockoutUntil) {
          const lockDate = new Date(lockoutUntil);
          if (lockDate > new Date()) {
            const minutesLeft = Math.ceil((lockDate.getTime() - Date.now()) / (1000 * 60));
            return { 
              success: false, 
              message: `บัญชีนี้ถูกระงับชั่วคราวเนื่องจากใส่รหัสผ่านผิดเกินกำหนด กรุณาลองใหม่ในอีก ${minutesLeft} นาที` 
            };
          }
        }
        
        // 2. Check if approved
        if (status !== 'ใช้งาน') {
          return { success: false, message: 'บัญชีนี้อยู่ระหว่างรอการอนุมัติ หรือถูกระงับการใช้งาน' };
        }
        
        // 3. Verify password Hash
        const salt = data[i][USER_COL.SALT - 1];
        const dbHash = data[i][USER_COL.PASSWORD_HASH - 1];
        const inputHash = computeSHA256(password, salt);
        
        if (inputHash === dbHash) {
          // Success: Reset failed attempts & update last login
          resetFailedAttempts(sheet, i);
          const dateNow = getFormattedDateTime();
          sheet.getRange(row, USER_COL.LAST_LOGIN).setValue(dateNow);
          
          const fullName = data[i][USER_COL.FULL_NAME - 1] || dbUsername;
          logActivity(fullName, 'เข้าสู่ระบบ', 'เข้าสู่ระบบสำเร็จ');
          
          return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            user: {
              User_id: data[i][USER_COL.ID - 1],
              Username: dbUsername,
              Full_name: fullName,
              Role: data[i][USER_COL.ROLE - 1],
              Email: data[i][USER_COL.EMAIL - 1],
              Department: data[i][USER_COL.DEPARTMENT - 1],
              Picture: data[i][USER_COL.PICTURE - 1]
            }
          };
        } else {
          // Failure: Increment failed attempts
          const currentAttempts = data[i][USER_COL.FAILED_ATTEMPTS - 1] || 0;
          const lockResult = incrementFailedAttempts(sheet, i, currentAttempts);
          
          let errMsg = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
          if (lockResult.locked) {
            errMsg = 'คุณระบุรหัสผ่านผิดเกิน 5 ครั้ง บัญชีนี้ถูกล็อกชั่วคราวเป็นเวลา 30 นาที';
          } else {
            errMsg += ` (คุณป้อนรหัสผิดไปแล้ว ${lockResult.attempts}/5 ครั้ง)`;
          }
          return { success: false, message: errMsg };
        }
      }
    }
    return { success: false, message: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' };
  } catch (error) {
    Logger.log('Error in loginUser: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาดของระบบ: ' + error.toString() };
  }
}

/**
 * Admins approve a pending user account
 */
function approveUser(userId) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][USER_COL.ID - 1] === userId) {
        const row = i + 1;
        sheet.getRange(row, USER_COL.STATUS).setValue('ใช้งาน');
        const name = data[i][USER_COL.FULL_NAME - 1] || userId;
        logActivity('Admin', 'อนุมัติผู้ใช้งาน', `อนุมัติบัญชีรหัส ${userId} (${name})`);
        return { success: true, message: 'อนุมัติเปิดใช้งานบัญชีสำเร็จ' };
      }
    }
    return { success: false, message: 'ไม่พบรหัสผู้ใช้งานที่ระบุ' };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Modifies an existing user's details
 */
function updateUser(userData) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][USER_COL.ID - 1] === userData.id) {
        const row = i + 1;
        if (userData.name || userData.full_name) {
          sheet.getRange(row, USER_COL.FULL_NAME).setValue(userData.name || userData.full_name);
        }
        if (userData.email) {
          sheet.getRange(row, USER_COL.EMAIL).setValue(userData.email);
        }
        if (userData.role) {
          sheet.getRange(row, USER_COL.ROLE).setValue(userData.role);
        }
        if (userData.phone) {
          sheet.getRange(row, USER_COL.PHONE).setValue("'" + (userData.phone || ''));
        }
        if (userData.department) {
          sheet.getRange(row, USER_COL.DEPARTMENT).setValue(userData.department || '');
        }
        if (userData.status) {
          sheet.getRange(row, USER_COL.STATUS).setValue(userData.status);
        }
        
        logActivity('Admin', 'แก้ไขข้อมูลผู้ใช้งาน', `แก้ไขข้อมูลรหัส ${userData.id}`);
        return { success: true, message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ' };
      }
    }
    return { success: false, message: 'ไม่พบผู้ใช้ที่ต้องการแก้ไข' };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Deletes a user account
 */
function deleteUser(userId) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][USER_COL.ID - 1] === userId) {
        const name = data[i][USER_COL.FULL_NAME - 1] || userId;
        sheet.deleteRow(i + 1);
        logActivity('Admin', 'ลบผู้ใช้งาน', `ลบบัญชีรหัส ${userId} (${name})`);
        return { success: true, message: 'ลบผู้ใช้งานสำเร็จ' };
      }
    }
    return { success: false, message: 'ไม่พบผู้ใช้ที่ต้องการลบ' };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
