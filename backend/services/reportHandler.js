const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const inspectionService = require('./inspectionService');
const buildingService = require('./buildingService');
const ExcelJS = require("exceljs");

async function generateReport(req, res) {
    let { buildingIds, startDate, endDate } = req.body;

    if ( buildingIds.includes('All') || !buildingIds || buildingIds.length < 1) {
        buildingIds = await buildingService.getAllBuildingIds();
    }

    const workbook = await createExcelWorkbook();

    let count = 1;

    for (const id of buildingIds) {
        const inspectionHistory = await inspectionService.getInspectionHistoryByBuildingAndDateRange(
            id,
            startDate,
            endDate,
            'All' // assuming 'All' users for the report
        );

        if (inspectionHistory.length > 0) {
            await createReportSheet(workbook, inspectionHistory);
            count++;
        }
    }


    res.set({
        'Content-Disposition': `attachment; filename="${getFileName()}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    await workbook.xlsx.write(res);
    res.status(200).end();

}

async function createExcelWorkbook(){
    return new ExcelJS.Workbook();
}

async function createReportSheet(workbook, inspectionHistory) {
    const sheet = workbook.addWorksheet(inspectionHistory[0].building.name);
    let checklistItems = await buildingService.getBuildingChecklistItems(inspectionHistory[0].buildingId);
    checklistItems = checklistItems.map(item => item.question);

    const row = ['user','date', ...checklistItems];
    //Add Header Row
    const header = sheet.addRow(row);
    header.font = {bold: true};
    header.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    for (const inspection of inspectionHistory) {
        const dataRow = [inspection.user, inspection.date];
        for (const item of checklistItems) {
            const answer = inspection.answers.find(ans => ans.question === item);
            dataRow.push(answer ? answer.textAnswer : '');
        }

        sheet.addRow(dataRow);
    }
}

function getFileName() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}-${year}`;
    return `inspections_report_${dateStr}.xlsx`;
}

module.exports = {generateReport}