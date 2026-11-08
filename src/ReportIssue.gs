// ReportIssue.gs
// ==================== REPORTING & EXPORTING SERVICES ====================

/**
 * Gets data for cost reports filtered by date range and category
 */
function getCostReportData(startDate, endDate, category = '') {
  try {
    const costsSheet = getOrCreateSheet(CONFIG.SHEETS.COSTS);
    const costsData = costsSheet.getDataRange().getValues();
    
    const monthlyData = {};
    const categoryData = {};
    let totalCost = 0;
    
    for (let i = 1; i < costsData.length; i++) {
      let date = costsData[i][7];
      const cost = parseFloat(costsData[i][6]) || 0;
      const type = costsData[i][8] || 'ทั่วไป';
      
      if (date && !(date instanceof Date)) {
        date = new Date(date);
      }
      
      if (!date || isNaN(date.getTime())) continue;
      
      const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      
      if (startDate && date < new Date(startDate)) continue;
      if (endDate && date > new Date(endDate)) continue;
      if (category && type !== category) continue;
      
      if (!monthlyData[month]) monthlyData[month] = 0;
      monthlyData[month] += cost;
      
      if (!categoryData[type]) categoryData[type] = 0;
      categoryData[type] += cost;
      
      totalCost += cost;
    }
    
    return { monthlyData: monthlyData, categoryData: categoryData, totalCost: totalCost };
  } catch (error) {
    Logger.log('Error getting cost report data: ' + error.toString());
    return { monthlyData: {}, categoryData: {}, totalCost: 0 };
  }
}

/**
 * Gets general system statistics for Dashboard cards
 */
function getSystemStats() {
  try {
    const repairs = getAllRepairs();
    const categories = getAllCategories();
    const users = getAllUsers();
    const assets = getAllAssets();
    
    const stats = {
      totalRepairs: repairs.length,
      totalCategories: categories.length,
      totalUsers: users.length,
      totalAssets: assets.length,
      pendingRepairs: 0,
      inProgressRepairs: 0,
      completedRepairs: 0,
      totalCost: 0
    };
    
    repairs.forEach(repair => {
      const st = String(repair.status || '').trim();
      if (st === 'รอดำเนินการ' || st === 'แจ้งปัญหา' || st === 'New') stats.pendingRepairs++;
      else if (st === 'กำลังซ่อม' || st === 'In Progress') stats.inProgressRepairs++;
      else if (st === 'เสร็จสิ้น' || st === 'Closed') stats.completedRepairs++;
      
      const cost = parseFloat(repair.cost) || 0;
      stats.totalCost += cost;
    });
    
    return stats;
  } catch (error) {
    Logger.log('Error getting system stats: ' + error.toString());
    return { totalRepairs: 0, totalCategories: 0, totalUsers: 0, totalAssets: 0, pendingRepairs: 0, inProgressRepairs: 0, completedRepairs: 0, totalCost: 0 };
  }
}

/**
 * Gets repair stats filtered by date range and category
 */
function getRepairStats(startDate, endDate, category = '') {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.REPAIRS);
    const data = sheet.getDataRange().getValues();
    
    const stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      byCategory: {},
      byMonth: {}
    };
    
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const status = String(data[i][10] || '').trim();
        const type = data[i][3] || 'ทั่วไป';
        const dateRaw = data[i][7];
        const date = dateRaw ? new Date(dateRaw) : new Date();

        if (startDate && endDate) {
          const repairDate = new Date(dateRaw);
          if (repairDate < new Date(startDate) || repairDate > new Date(endDate)) continue;
        }

        if (category && type !== category) continue;

        stats.total++;

        if (status === 'เสร็จสิ้น' || status === 'Closed') stats.completed++;
        else if (status === 'กำลังซ่อม' || status === 'In Progress') stats.inProgress++;
        else if (status === 'รอดำเนินการ' || status === 'แจ้งปัญหา' || status === 'New') stats.pending++;

        if (!stats.byCategory[type]) stats.byCategory[type] = 0;
        stats.byCategory[type]++;

        if (!isNaN(date.getTime())) {
          const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!stats.byMonth[month]) stats.byMonth[month] = 0;
          stats.byMonth[month]++;
        }
      }
    }
    return stats;
  } catch (error) {
    Logger.log('Error in getRepairStats: ' + error.toString());
    return { total: 0, completed: 0, inProgress: 0, pending: 0, byCategory: {}, byMonth: {} };
  }
}

/**
 * ดึงรายงาน Top 5 ครุภัณฑ์ที่มีการแจ้งซ่อมซ้ำมากที่สุด
 */
function getTopRepairedAssets(limit = 5) {
  try {
    const repairs = getAllRepairs();
    const countMap = {};
    
    repairs.forEach(r => {
      const key = r.assetId || r.assetCode || 'ไม่ระบุ';
      if (!countMap[key]) {
        countMap[key] = {
          assetId: r.assetId,
          assetName: r.assetCode,
          type: r.type,
          count: 0,
          totalCost: 0
        };
      }
      countMap[key].count++;
      countMap[key].totalCost += parseFloat(r.cost) || 0;
    });
    
    const sorted = Object.values(countMap).sort((a, b) => b.count - a.count);
    return sorted.slice(0, limit);
  } catch (e) {
    Logger.log('Error in getTopRepairedAssets: ' + e.toString());
    return [];
  }
}

/**
 * Export รายการแจ้งซ่อมเป็น CSV String (UTF-8 with BOM)
 */
function exportRepairsToCsv() {
  const repairs = getAllRepairs();
  const headers = ['Ticket_ID', 'Asset_ID', 'ชื่อพัสดุ/เลขครุภัณฑ์', 'ประเภทพัสดุ', 'ปัญหา', 'ความเร่งด่วน', 'ช่างผู้รับผิดชอบ', 'วันที่แจ้ง', 'สถานะ', 'ค่าใช้จ่าย'];
  
  let csv = '\uFEFF' + headers.join(',') + '\n';
  repairs.forEach(r => {
    const row = [
      `"${r.id}"`,
      `"${r.assetId}"`,
      `"${(r.assetCode || '').replace(/"/g, '""')}"`,
      `"${r.type}"`,
      `"${(r.problem || '').replace(/"/g, '""')}"`,
      `"${r.priority}"`,
      `"${r.technician}"`,
      `"${r.reportDate}"`,
      `"${r.status}"`,
      r.cost
    ];
    csv += row.join(',') + '\n';
  });
  return csv;
}
