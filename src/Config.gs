// Config.gs
// ==================== CONFIGURATION ====================

const CONFIG = {
  // 1. ใส่ ID ของโฟลเดอร์สำหรับเก็บรูปภาพและเอกสารแนบ (pic_itcare)
  FOLDER_ID: '15w-DCPUL09HetfwsVzaWo6-5lxUH3xqZ', 
  
  // 2. ใส่ ID ของไฟล์ Google Sheets (DBS_ITSD)
  SPREADSHEET_ID: '1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs', 
  
  // 3. ผูกชื่อแท็บ (Sheet Names) ให้ตรงกับโครงสร้างจริงในชีต DBS_ITSD
  SHEETS: {
    REPAIRS: 'Ticket_Incident',     // รายการแจ้งซ่อม
    ASSETS: 'Asset',                // ทะเบียนครุภัณฑ์
    CATEGORIES: 'Master_Reference', // แคตตาล็อกประเภท/แบรนด์/รุ่น
    USERS: 'Users',                 // บัญชีผู้ใช้และสิทธิ์
    LOGS: 'SystemLog',              // บันทึกการใช้งาน Audit Log
    COSTS: 'Cost',                  // บันทึกค่าใช้จ่าย
    SETTINGS: ' Setting',           // การตั้งค่าระบบ (ตรงกับชื่อชีตจริงที่มี space ด้านหน้า)
    ASSET_DEL: 'Asset_del',         // ถังขยะครุภัณฑ์ที่ถูกลบ
    TECH_SPEC: 'Tecnical_Spec',     // สเปกทางเทคนิค
    DATA_DIC: 'Data_Dic',           // พจนานุกรมข้อมูล
    REFERENCE: 'Reference'          // ตารางอ้างอิง
  },
  
  // 4. การตั้งค่าแจ้งเตือน Telegram (ถ้ามี)
  TELEGRAM: {
    BOT_TOKEN: '',
    CHAT_ID: ''
  }
};

// ==================== COLUMN MAPPING ====================
// กำหนดตำแหน่งคอลัมน์ของตารางผู้ใช้งาน (Users - 18 คอลัมน์)
const USER_COL = {
  ID: 1,
  USERNAME: 2,
  PASSWORD_HASH: 3,
  SALT: 4,
  FULL_NAME: 5,
  NAME: 5, // Alias for compatibility
  EMAIL: 6,
  PHONE: 7,
  DEPARTMENT: 8,
  ROLE: 9,
  STATUS: 10,
  REGISTRATION_DATE: 11,
  LAST_LOGIN: 12,
  FAILED_ATTEMPTS: 13,
  LOCKOUT_UNTIL: 14,
  RESET_TOKEN: 15,
  RESET_TOKEN_EXPIRES: 16,
  PICTURE: 17,
  LINE_USER_ID: 18
};

// กำหนดตำแหน่งคอลัมน์ของตารางพัสดุ/ครุภัณฑ์ (Asset - 20 คอลัมน์)
const ASSET_COL = {
  ASSET_ID: 1,
  ASSET_TAG: 2,
  ASSET_NUMBER: 3,
  DEVICE_TYPE: 4,
  BRAND: 5,
  MODEL: 6,
  SERIAL_NUMBER: 7,
  FISCAL_YEAR: 8,
  PROJECT_NAME: 9,
  RECEIVE_DATE: 10,
  WARRANTY_PERIOD: 11,
  WARRANTY_END_DATE: 12,
  VENDOR: 13,
  OWNER_DEPARTMENT: 14,
  LOCATION: 15,
  BUREAU: 16,
  SECTION: 17,
  ASSIGNED_USER: 18,
  STATUS: 19,
  REMARKS: 20
};

// ==================== GLOBAL VARIABLES ====================
let mainFolder = null;
let mainSpreadsheet = null;

// ==================== CORE HELPERS ====================
/**
 * Helper to get or create a sheet by name (รองรับชื่อชีตที่มีช่องว่างหรือ Case sensitivity)
 */
function getOrCreateSheet(sheetName) {
  if (!mainSpreadsheet) {
    mainSpreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  // 1. ค้นหาแบบตรงตัว
  let sheet = mainSpreadsheet.getSheetByName(sheetName);
  if (sheet) return sheet;

  // 2. ค้นหาแบบตัดช่องว่าง (Trimmed match)
  const sheets = mainSpreadsheet.getSheets();
  for (let s of sheets) {
    if (s.getName().trim() === sheetName.trim()) {
      return s;
    }
  }

  // 3. หากไม่มี ให้สร้างชีตใหม่
  sheet = mainSpreadsheet.insertSheet(sheetName);
  return sheet;
}

/**
 * Helper to get the current date and time formatted as M/d/yyyy HH:mm:ss
 */
function getFormattedDateTime(date = new Date()) {
  return Utilities.formatDate(date, "Asia/Bangkok", "M/d/yyyy HH:mm:ss");
}

/**
 * Format Date object to YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    if (date.length >= 10 && date.includes('-')) return date.substring(0, 10);
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return '';
  return Utilities.formatDate(date, "Asia/Bangkok", "yyyy-MM-dd");
}

/**
 * Format headers helper with blue styling
 */
function formatHeaders(sheet, columnCount) {
  try {
    const range = sheet.getRange(1, 1, 1, columnCount);
    range.setBackground('#2563eb')
         .setFontColor('#ffffff')
         .setFontWeight('bold')
         .setHorizontalAlignment('center');
  } catch (e) {
    Logger.log('formatHeaders error: ' + e.toString());
  }
}
