// SecurityService.gs
// ==================== SECURITY & ENCRYPTION SERVICES ====================

/**
 * Computes SHA-256 hash of password with a salt
 */
function computeSHA256(password, salt) {
  const raw = password + salt;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  let hash = '';
  for (let i = 0; i < digest.length; i++) {
    let byteVal = digest[i];
    if (byteVal < 0) byteVal += 256;
    let byteString = byteVal.toString(16);
    if (byteString.length == 1) byteString = '0' + byteString;
    hash += byteString;
  }
  return hash;
}

/**
 * Generates a random alphanumeric salt string
 */
function generateSalt() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

/**
 * Increments failed login attempts for a user
 */
function incrementFailedAttempts(sheet, rowIndex, currentAttempts) {
  const row = rowIndex + 1;
  const newAttempts = (parseInt(currentAttempts) || 0) + 1;
  sheet.getRange(row, USER_COL.FAILED_ATTEMPTS).setValue(newAttempts);
  
  if (newAttempts >= 5) {
    // Lock account for 30 minutes
    const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    sheet.getRange(row, USER_COL.LOCKOUT_UNTIL).setValue(getFormattedDateTime(lockUntil));
    return { locked: true, lockUntil: lockUntil };
  }
  return { locked: false, attempts: newAttempts };
}

/**
 * Resets failed attempts and lockout status
 */
function resetFailedAttempts(sheet, rowIndex) {
  const row = rowIndex + 1;
  sheet.getRange(row, USER_COL.FAILED_ATTEMPTS).setValue(0);
  sheet.getRange(row, USER_COL.LOCKOUT_UNTIL).setValue('');
}
