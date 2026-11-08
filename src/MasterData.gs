// MasterData.gs
// ==================== MASTER DATA SERVICES ====================

/**
 * Helper to cache data in script cache
 */
function setCachedData(key, data, expirationSeconds = 60) {
  try {
    const cache = CacheService.getScriptCache();
    cache.put(key, JSON.stringify(data), expirationSeconds);
  } catch (e) {
    Logger.log('Error caching data for key ' + key + ': ' + e.toString());
  }
}

/**
 * Helper to retrieve cached data
 */
function getCachedData(key) {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    Logger.log('Error retrieving cached data for key ' + key + ': ' + e.toString());
    return null;
  }
}

/**
 * ดึงข้อมูลอุปกรณ์ทั้งหมดจากแท็บ Asset (อ้างอิงตามโครงสร้าง 20 คอลัมน์)
 */
function getAllAssets() {
  const cacheKey = 'assets_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const sheet = getOrCreateSheet(CONFIG.SHEETS.ASSETS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[ASSET_COL.ASSET_ID - 1]) continue;

    result.push({
      Asset_ID: row[ASSET_COL.ASSET_ID - 1] || '',
      Asset_Tag: row[ASSET_COL.ASSET_TAG - 1] || '',
      Asset_Number: row[ASSET_COL.ASSET_NUMBER - 1] || '',
      Device_Type: row[ASSET_COL.DEVICE_TYPE - 1] || '',
      Brand: row[ASSET_COL.BRAND - 1] || '',
      Model: row[ASSET_COL.MODEL - 1] || '',
      Name: (row[ASSET_COL.BRAND - 1] || '') + ' ' + (row[ASSET_COL.MODEL - 1] || ''),
      Serial_Number: row[ASSET_COL.SERIAL_NUMBER - 1] || '',
      Fiscal_Year: row[ASSET_COL.FISCAL_YEAR - 1] || '',
      Project_Name: row[ASSET_COL.PROJECT_NAME - 1] || '',
      Receive_Date: row[ASSET_COL.RECEIVE_DATE - 1] ? formatDate(row[ASSET_COL.RECEIVE_DATE - 1]) : '',
      Warranty_Period: row[ASSET_COL.WARRANTY_PERIOD - 1] || '',
      Warranty_End_Date: row[ASSET_COL.WARRANTY_END_DATE - 1] ? formatDate(row[ASSET_COL.WARRANTY_END_DATE - 1]) : '',
      Vendor: row[ASSET_COL.VENDOR - 1] || '',
      Owner_Department: row[ASSET_COL.OWNER_DEPARTMENT - 1] || '',
      Location: row[ASSET_COL.LOCATION - 1] || '',
      Bureau: row[ASSET_COL.BUREAU - 1] || '',
      Section: row[ASSET_COL.SECTION - 1] || '',
      Assigned_User: row[ASSET_COL.ASSIGNED_USER - 1] || '',
      Status: row[ASSET_COL.STATUS - 1] || '',
      Remarks: row[ASSET_COL.REMARKS - 1] || ''
    });
  }
  
  setCachedData(cacheKey, result, 60);
  return result;
}

/**
 * ดึงข้อมูลการแจ้งซ่อมทั้งหมดจากแท็บ Ticket_Incident
 */
function getAllRepairs() {
  const cacheKey = 'repairs_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    
    result.push({
      id: row[0] || '',                 // คอลัมน์ A: Ticket_ID
      assetId: row[1] || '',            // คอลัมน์ B: Asset_ID
      assetCode: row[2] || '',          // คอลัมน์ C: เลขครุภัณฑ์/ชื่อพัสดุ
      type: row[3] || '',               // คอลัมน์ D: ประเภทพัสดุ
      problem: row[4] || '',            // คอลัมน์ E: รายละเอียดปัญหา
      priority: row[5] || '',           // คอลัมน์ F: ระดับความเร่งด่วน
      technician: row[6] || '',         // คอลัมน์ G: ช่างผู้รับผิดชอบ
      reportDate: row[7] ? formatDate(row[7]) : '', // คอลัมน์ H: วันที่แจ้ง
      startDate: row[8] ? formatDate(row[8]) : '',  // คอลัมน์ I: วันที่เริ่มซ่อม
      endDate: row[9] ? formatDate(row[9]) : '',    // คอลัมน์ J: วันที่เสร็จสิ้น
      status: row[10] || '',            // คอลัมน์ K: สถานะการซ่อม
      cost: row[11] || 0,               // คอลัมน์ L: ค่าใช้จ่าย
      notes: row[12] || '',             // คอลัมน์ M: หมายเหตุ
      reporter: row[13] || '',          // คอลัมน์ N: ผู้แจ้ง
      createdDate: row[14] ? formatDate(row[14]) : '' // คอลัมน์ O: วันที่สร้าง
    });
  }
  
  setCachedData(cacheKey, result, 60);
  return result;
}

/**
 * ดึงข้อมูลผู้ใช้งานทั้งหมดจากแท็บ Users
 */
function getAllUsers() {
  const cacheKey = 'users_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const sheet = getOrCreateSheet(CONFIG.SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[USER_COL.ID - 1]) continue;

    result.push({
      id: row[USER_COL.ID - 1],
      username: row[USER_COL.USERNAME - 1] || '',
      name: row[USER_COL.FULL_NAME - 1] || '',
      email: row[USER_COL.EMAIL - 1] || '',
      phone: row[USER_COL.PHONE - 1] || '',
      department: row[USER_COL.DEPARTMENT - 1] || '',
      role: row[USER_COL.ROLE - 1] || '',
      status: row[USER_COL.STATUS - 1] || '',
      registrationDate: row[USER_COL.REGISTRATION_DATE - 1] ? formatDate(row[USER_COL.REGISTRATION_DATE - 1]) : '',
      lastLogin: row[USER_COL.LAST_LOGIN - 1] || ''
    });
  }

  setCachedData(cacheKey, result, 60);
  return result;
}

/**
 * ดึงข้อมูลหมวดหมู่ทั้งหมดจากแท็บ Master_Reference
 */
function getAllCategories() {
  const cacheKey = 'categories_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const sheet = getOrCreateSheet(CONFIG.SHEETS.CATEGORIES);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    
    // In Master_Reference:
    // Col 0: Reference ID (e.g. MRF-001)
    // Col 1: Device Type (e.g. Computer PC)
    // Col 2: Brand (e.g. Dell)
    // Col 3: Model (e.g. Dell OptiPlex 390)
    const refId = (row[0] || ('CAT-' + i)).toString().trim();
    const typeName = row[1] ? row[1].toString().trim() : (row[0] ? row[0].toString().trim() : '');
    const brand = row[2] ? row[2].toString().trim() : '';
    const model = row[3] ? row[3].toString().trim() : '';
    
    result.push({
      id: refId,
      name: typeName,
      brand: brand,
      model: model,
      description: (brand + ' ' + model).trim(),
      count: 0
    });
  }
  
  setCachedData(cacheKey, result, 60);
  return result;
}

/**
 * ดึงรายชื่อช่างเทคนิคจากฐานข้อมูล
 */
function getAllTechnicians() {
  const users = getAllUsers();
  return users.filter(u => u.role === 'Technician' || u.role === 'Admin');
}

/**
 * ดึงรายชื่อแผนก/สำนักทั้งหมดที่มี
 */
function getAllDepartments() {
  const assets = getAllAssets();
  const deptSet = new Set();
  assets.forEach(a => {
    if (a.Owner_Department) deptSet.add(a.Owner_Department);
    if (a.Bureau) deptSet.add(a.Bureau);
  });
  return Array.from(deptSet).sort();
}
