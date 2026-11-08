// Main.gs
// ==================== HTTP GATEWAY & API CONTROLLER ====================

function getDashboardData(data) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;
  
  return {
    success: true,
    data: {
      categories: getAllCategories(),
      repairs: getAllRepairs(),
      assets: getAllAssets(),
      costReport: getCostReportData(startDate, endDate, ''),
      repairStats: getRepairStats(startDate, endDate, '')
    }
  };
}

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'login';
  const action = (e && e.parameter && e.parameter.action) || '';
  const sessionToken = (e && e.parameter && e.parameter.token) || '';

  try {
    // === ฟังก์ชันสำหรับล้างแคชด้วย URL ?action=clearcache ===
    if (action === 'clearcache') {
      const cache = CacheService.getScriptCache();
      cache.removeAll(['categories_data', 'assets_data', 'repairs_data', 'users_data', 'costs_data']);
      
      if (sessionToken) {
        cache.remove('session_' + sessionToken);
      }
      return serveLoginPage('ล้างแคชระบบเรียบร้อยแล้ว');
    }

    if (page === 'index') {
      // Validate server-side session before serving dashboard
      if (!sessionToken) {
        return serveLoginPage('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      }
      const cache = CacheService.getScriptCache();
      const sessionData = cache.get('session_' + sessionToken);
      if (!sessionData) {
        return serveLoginPage('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
      }

      // Extend session TTL on each valid access (6 hours)
      cache.put('session_' + sessionToken, sessionData, 21600);

      const template = HtmlService.createTemplateFromFile('Index');
      template.scriptUrl = ScriptApp.getService().getUrl();
      template.userData = sessionData;
      template.sessionToken = sessionToken;
      return template.evaluate()
        .setTitle('ITSD : ITServiceDesk - ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }

    // Default: serve login page
    return serveLoginPage('');

  } catch (err) {
    Logger.log('doGet error: ' + err.toString());
    return serveLoginPage('เกิดข้อผิดพลาด กรุณาลองใหม่');
  }
}

function serveLoginPage(errorMsg) {
  const template = HtmlService.createTemplateFromFile('Login');
  template.scriptUrl = ScriptApp.getService().getUrl();
  template.errorMsg = errorMsg || '';
  template.version = (CONFIG.SYSTEM_INFO && CONFIG.SYSTEM_INFO.VERSION) || 'ITSD V1.0.01';
  template.patch = (CONFIG.SYSTEM_INFO && CONFIG.SYSTEM_INFO.PATCH) || 'Build 01';
  template.patchFull = (CONFIG.SYSTEM_INFO && CONFIG.SYSTEM_INFO.PATCH_FULL) || 'Patch Update: Build 01 (2026-11-09)';
  template.developer = (CONFIG.SYSTEM_INFO && CONFIG.SYSTEM_INFO.DEVELOPER) || 'Create by : LongZe Design';
  return template.evaluate()
    .setTitle('เข้าสู่ระบบ - ITSD : ITServiceDesk')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==================== SERVER-SIDE SESSION MANAGEMENT ====================

function createSession(userData) {
  const token = Utilities.getUuid();
  const cache = CacheService.getScriptCache();
  cache.put('session_' + token, JSON.stringify(userData), 21600); // 6 hours
  return token;
}

function validateSession(token) {
  if (!token) return null;
  const cache = CacheService.getScriptCache();
  const data = cache.get('session_' + token);
  return data ? JSON.parse(data) : null;
}

function destroySession(token) {
  if (!token) return { success: true };
  const cache = CacheService.getScriptCache();
  cache.remove('session_' + token);
  return { success: true };
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = handleApiCall(postData.action, postData.data);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiCall(action, data) {
  try {
    if (!mainSpreadsheet) {
      mainSpreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    }
    switch (action) {
      // System Handlers
      case 'initialize':
        return initializeSystem();
      case 'backupData':
        return backupSpreadsheet();
      case 'setupBackupTrigger':
        return setupBackupTrigger();
        
      // Authentication Handlers
      case 'register':
        return registerUser(data);
      case 'login':
        const loginResult = loginUser(data.Username, data.Password);
        if (loginResult.success) {
          const token = createSession(loginResult.user);
          return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token: token,
            user: loginResult.user
          };
        }
        return loginResult;
      case 'logout':
        return destroySession(data.token);
      case 'validateSession':
        const user = validateSession(data.token);
        return { success: !!user, user: user };
        
      // Repair Issue Handlers
      case 'addRepair':
        return addRepair(data);
      case 'updateRepair':
        return updateRepair(data);
      case 'approveRepair':
        return approveRepair(data.repairId, data.technician);
      case 'getAllRepairs':
        return { success: true, data: getAllRepairs() };
        
      // Asset Handlers
      case 'addAsset':
        return addAsset(data);
      case 'updateAsset':
        return updateAsset(data);
      case 'deleteAsset':
        return deleteAsset(data.assetId);
      case 'getAllAssets':
        return { success: true, data: getAllAssets() };
        
      // Master Data Handlers
      case 'getAllCategories':
        return { success: true, data: getAllCategories() };
      case 'getAllUsers':
        return { success: true, data: getAllUsers() };
      case 'getAllTechnicians':
        return { success: true, data: getAllTechnicians() };
      case 'getAllDepartments':
        return { success: true, data: getAllDepartments() };
      case 'getDashboardData':
        return getDashboardData(data);
        
      // User Management
      case 'approveUser':
        return approveUser(data.userId);
      case 'updateUser':
        return updateUser(data);
      case 'deleteUser':
        return deleteUser(data.userId);
        
      // Report Handlers
      case 'getCostReport':
        return { success: true, data: getCostReportData(data.startDate, data.endDate, data.category) };
      case 'getRepairStats':
        return { success: true, data: getRepairStats(data.startDate, data.endDate, data.category) };
      case 'getTopRepairedAssets':
        return { success: true, data: getTopRepairedAssets(data.limit || 5) };
      case 'getSystemStats':
        return { success: true, data: getSystemStats() };
      case 'exportRepairsToCsv':
        return { success: true, data: exportRepairsToCsv() };
        
      // Notification Settings
      case 'getNotificationSettings':
        return { success: true, data: getNotificationSettings() };
      case 'updateNotificationSettings':
        return updateNotificationSettings(data);
        
      default:
        return { success: false, message: 'ไม่พบคำสั่งที่เรียก: ' + action };
    }
  } catch (error) {
    Logger.log('Error handling API call ' + action + ': ' + error.toString());
    return { success: false, message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
