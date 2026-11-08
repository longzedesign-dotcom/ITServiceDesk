// AssetOperations.gs
// ==================== ASSET CRUD OPERATIONS ====================

/**
 * Generate a unique Asset ID (e.g., AST-20260626-XXXX)
 */
function generateAssetId() {
  const dateStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyyMMdd");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AST-${dateStr}-${randomStr}`;
}

/**
 * Upload an image to Google Drive and return the file URL
 */
function uploadAssetImage(base64Data, filename) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const contentType = base64Data.substring(5, base64Data.indexOf(';'));
    const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, filename);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    Logger.log('Error uploading image: ' + e.toString());
    return '';
  }
}

/**
 * Add a new asset to the Asset tab
 */
function addAsset(data) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.ASSETS);
    const newId = generateAssetId();
    
    // Upload image if provided
    let remarks = data.Remarks || '';
    if (data.image) {
      const imageUrl = uploadAssetImage(data.image, `Asset_${newId}.jpg`);
      if (imageUrl) {
        remarks = (remarks ? remarks + '\n' : '') + 'Image: ' + imageUrl;
      }
    }
    
    // Create an empty array with 20 columns
    const rowData = new Array(20).fill('');
    
    rowData[ASSET_COL.ASSET_ID - 1] = newId;
    rowData[ASSET_COL.ASSET_TAG - 1] = data.Asset_Tag || '';
    rowData[ASSET_COL.ASSET_NUMBER - 1] = data.Asset_Number || '';
    rowData[ASSET_COL.DEVICE_TYPE - 1] = data.Device_Type || '';
    rowData[ASSET_COL.BRAND - 1] = data.Brand || '';
    rowData[ASSET_COL.MODEL - 1] = data.Model || '';
    rowData[ASSET_COL.SERIAL_NUMBER - 1] = data.Serial_Number || '';
    rowData[ASSET_COL.FISCAL_YEAR - 1] = data.Fiscal_Year || '';
    rowData[ASSET_COL.PROJECT_NAME - 1] = data.Project_Name || '';
    rowData[ASSET_COL.RECEIVE_DATE - 1] = data.Receive_Date || '';
    rowData[ASSET_COL.WARRANTY_PERIOD - 1] = data.Warranty_Period || '';
    rowData[ASSET_COL.WARRANTY_END_DATE - 1] = data.Warranty_End_Date || '';
    rowData[ASSET_COL.VENDOR - 1] = data.Vendor || '';
    rowData[ASSET_COL.OWNER_DEPARTMENT - 1] = data.Owner_Department || '';
    rowData[ASSET_COL.LOCATION - 1] = data.Location || '';
    rowData[ASSET_COL.BUREAU - 1] = data.Bureau || '';
    rowData[ASSET_COL.SECTION - 1] = data.Section || '';
    rowData[ASSET_COL.ASSIGNED_USER - 1] = data.Assigned_User || '';
    rowData[ASSET_COL.STATUS - 1] = data.Status || 'ใช้งาน';
    rowData[ASSET_COL.REMARKS - 1] = remarks;
    
    sheet.appendRow(rowData);
    
    // Clear cache
    const cache = CacheService.getScriptCache();
    cache.remove('assets_data');
    
    logActivity('Admin', 'เพิ่มข้อมูลครุภัณฑ์', `เพิ่มครุภัณฑ์ใหม่ รหัส: ${newId} (${data.Brand} ${data.Model})`);
    
    return { success: true, message: 'เพิ่มข้อมูลครุภัณฑ์เรียบร้อยแล้ว', assetId: newId };
  } catch (error) {
    Logger.log('Error adding asset: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Update an existing asset
 */
function updateAsset(data) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.ASSETS);
    const values = sheet.getDataRange().getValues();
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][ASSET_COL.ASSET_ID - 1]) === String(data.Asset_ID)) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, message: 'ไม่พบครุภัณฑ์ที่ต้องการแก้ไข' };
    }
    
    let remarks = data.Remarks || values[rowIndex - 1][ASSET_COL.REMARKS - 1];
    if (data.image) {
      const imageUrl = uploadAssetImage(data.image, `Asset_${data.Asset_ID}.jpg`);
      if (imageUrl) {
        remarks = (remarks ? remarks + '\n' : '') + 'Image: ' + imageUrl;
      }
    }
    
    sheet.getRange(rowIndex, ASSET_COL.ASSET_TAG).setValue(data.Asset_Tag || '');
    sheet.getRange(rowIndex, ASSET_COL.ASSET_NUMBER).setValue(data.Asset_Number || '');
    sheet.getRange(rowIndex, ASSET_COL.DEVICE_TYPE).setValue(data.Device_Type || '');
    sheet.getRange(rowIndex, ASSET_COL.BRAND).setValue(data.Brand || '');
    sheet.getRange(rowIndex, ASSET_COL.MODEL).setValue(data.Model || '');
    sheet.getRange(rowIndex, ASSET_COL.SERIAL_NUMBER).setValue(data.Serial_Number || '');
    sheet.getRange(rowIndex, ASSET_COL.FISCAL_YEAR).setValue(data.Fiscal_Year || '');
    sheet.getRange(rowIndex, ASSET_COL.PROJECT_NAME).setValue(data.Project_Name || '');
    sheet.getRange(rowIndex, ASSET_COL.RECEIVE_DATE).setValue(data.Receive_Date || '');
    sheet.getRange(rowIndex, ASSET_COL.WARRANTY_PERIOD).setValue(data.Warranty_Period || '');
    sheet.getRange(rowIndex, ASSET_COL.WARRANTY_END_DATE).setValue(data.Warranty_End_Date || '');
    sheet.getRange(rowIndex, ASSET_COL.VENDOR).setValue(data.Vendor || '');
    sheet.getRange(rowIndex, ASSET_COL.OWNER_DEPARTMENT).setValue(data.Owner_Department || '');
    sheet.getRange(rowIndex, ASSET_COL.LOCATION).setValue(data.Location || '');
    sheet.getRange(rowIndex, ASSET_COL.BUREAU).setValue(data.Bureau || '');
    sheet.getRange(rowIndex, ASSET_COL.SECTION).setValue(data.Section || '');
    sheet.getRange(rowIndex, ASSET_COL.ASSIGNED_USER).setValue(data.Assigned_User || '');
    sheet.getRange(rowIndex, ASSET_COL.STATUS).setValue(data.Status || 'ใช้งาน');
    sheet.getRange(rowIndex, ASSET_COL.REMARKS).setValue(remarks);
    
    const cache = CacheService.getScriptCache();
    cache.remove('assets_data');
    
    logActivity('Admin', 'แก้ไขข้อมูลครุภัณฑ์', `แก้ไขครุภัณฑ์รหัส: ${data.Asset_ID}`);
    return { success: true, message: 'อัปเดตข้อมูลครุภัณฑ์เรียบร้อยแล้ว' };
  } catch (error) {
    Logger.log('Error updating asset: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}

/**
 * Delete an asset (Safely moves to Asset_del)
 */
function deleteAsset(assetId) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.ASSETS);
    const values = sheet.getDataRange().getValues();
    
    let rowIndex = -1;
    let rowData = null;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][ASSET_COL.ASSET_ID - 1]) === String(assetId)) {
        rowIndex = i + 1;
        rowData = values[i];
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, message: 'ไม่พบครุภัณฑ์ที่ต้องการลบ' };
    }
    
    // ย้ายไปเก็บในถังขยะ Asset_del
    const delSheet = getOrCreateSheet(CONFIG.SHEETS.ASSET_DEL);
    const backupRow = [...rowData, getFormattedDateTime(), 'Admin'];
    delSheet.appendRow(backupRow);
    
    // ลบออกจากตารางหลัก
    sheet.deleteRow(rowIndex);
    
    const cache = CacheService.getScriptCache();
    cache.remove('assets_data');
    
    logActivity('Admin', 'ลบข้อมูลครุภัณฑ์', `ลบครุภัณฑ์รหัส: ${assetId} (ย้ายไป Asset_del)`);
    return { success: true, message: 'ลบข้อมูลครุภัณฑ์เรียบร้อยแล้ว' };
  } catch (error) {
    Logger.log('Error deleting asset: ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
