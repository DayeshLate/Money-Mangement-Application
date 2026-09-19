import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const exportExcelReport = async (req, res) => {
  try {
    const { title = 'Transaction Report', transactions = [], summary = {} } = req.body;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Money Manager Microservice';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Transactions');

    // Styling headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Type', key: 'type', width: 14 },
      { header: 'Name / Description', key: 'name', width: 28 },
      { header: 'Category', key: 'categoryName', width: 20 },
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Amount (₹)', key: 'amount', width: 18 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' } // Indigo
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 24;

    // Add rows
    transactions.forEach((tx) => {
      const row = worksheet.addRow({
        id: tx.id,
        type: (tx.type || 'expense').toUpperCase(),
        name: tx.name || '-',
        categoryName: tx.categoryName || tx.categoryId || '-',
        date: tx.date || '-',
        amount: Number(tx.amount || 0)
      });

      // Color code by type
      const isIncome = (tx.type || '').toLowerCase() === 'income';
      row.getCell('type').font = { color: { argb: isIncome ? 'FF16A34A' : 'FFDC2626' }, bold: true };
      row.getCell('amount').numFmt = '#,##0.00';
    });

    // Summary row
    if (summary.totalIncome !== undefined || summary.totalExpense !== undefined) {
      worksheet.addRow([]);
      const totalRow = worksheet.addRow({
        name: 'TOTAL EXPENSE',
        amount: summary.totalExpense || 0
      });
      totalRow.font = { bold: true };
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="money_manager_report_${Date.now()}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('[ReportController] Excel export error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Excel report', error: error.message });
  }
};

export const exportPdfReport = async (req, res) => {
  try {
    const { title = 'Statement of Transactions', transactions = [], summary = {}, user = {} } = req.body;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="statement_${Date.now()}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc.fillColor('#4F46E5').fontSize(22).text('Money Manager', { bold: true });
    doc.fillColor('#64748B').fontSize(11).text(title, { italic: true });
    doc.moveDown(0.5);

    if (user.fullName) {
      doc.fillColor('#334155').fontSize(10).text(`Account Holder: ${user.fullName} (${user.email || ''})`);
    }
    doc.fillColor('#64748B').fontSize(10).text(`Generated On: ${new Date().toLocaleDateString()}`);
    doc.moveDown(1);

    // Divider
    doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    // Summary metrics if provided
    if (summary.totalIncome !== undefined || summary.totalExpense !== undefined) {
      const startY = doc.y;
      doc.rect(40, startY, 515, 45).fill('#F8FAFC');
      doc.fillColor('#16A34A').fontSize(11).text(`Total Income: ₹${summary.totalIncome || 0}`, 55, startY + 16);
      doc.fillColor('#DC2626').fontSize(11).text(`Total Expense: ₹${summary.totalExpense || 0}`, 220, startY + 16);
      const balance = (summary.totalIncome || 0) - (summary.totalExpense || 0);
      doc.fillColor('#1E293B').fontSize(11).text(`Net Balance: ₹${balance}`, 390, startY + 16);
      doc.y = startY + 60;
    }

    // Table Header
    const tableTop = doc.y;
    doc.fillColor('#1E293B').fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 45, tableTop);
    doc.text('Description', 130, tableTop);
    doc.text('Category', 300, tableTop);
    doc.text('Type', 410, tableTop);
    doc.text('Amount (₹)', 480, tableTop, { align: 'right', width: 70 });

    doc.strokeColor('#CBD5E1').lineWidth(0.5).moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke();

    let currentY = tableTop + 22;
    doc.font('Helvetica');

    transactions.forEach((tx) => {
      // Check page overflow
      if (currentY > 750) {
        doc.addPage();
        currentY = 50;
      }

      const isIncome = (tx.type || '').toLowerCase() === 'income';
      doc.fillColor('#475569').fontSize(9).text(tx.date || '-', 45, currentY);
      doc.fillColor('#1E293B').fontSize(9).text((tx.name || '-').slice(0, 24), 130, currentY);
      doc.fillColor('#64748B').fontSize(9).text((tx.categoryName || '-').slice(0, 18), 300, currentY);
      doc.fillColor(isIncome ? '#16A34A' : '#DC2626').fontSize(9).text((tx.type || 'expense').toUpperCase(), 410, currentY);
      doc.fillColor(isIncome ? '#16A34A' : '#DC2626').fontSize(9).text(
        `₹${Number(tx.amount || 0).toFixed(2)}`,
        480,
        currentY,
        { align: 'right', width: 70 }
      );

      currentY += 20;
    });

    // Footer
    doc.fontSize(8).fillColor('#94A3B8').text(
      'Money Manager Automated Report • Keep track of your daily expenses smartly.',
      40,
      780,
      { align: 'center', width: 515 }
    );

    doc.end();
  } catch (error) {
    console.error('[ReportController] PDF export error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF report', error: error.message });
  }
};
