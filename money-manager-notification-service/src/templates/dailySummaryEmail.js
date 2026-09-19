export const getDailySummaryEmailHtml = ({ name, date, expenses = [], totalExpense = 0, currency = '₹' }) => {
  const expenseRows = expenses.length > 0
    ? expenses.map((exp, index) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 14px; font-size: 14px; color: #64748b;">${index + 1}</td>
          <td style="padding: 12px 14px; font-size: 14px; font-weight: 500; color: #1e293b;">${exp.name || 'Expense'}</td>
          <td style="padding: 12px 14px; font-size: 14px; color: #64748b;">${exp.categoryName || '-'}</td>
          <td style="padding: 12px 14px; font-size: 14px; font-weight: 600; text-align: right; color: #ef4444;">${currency} ${Number(exp.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="4" style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px;">No expenses recorded today. Great job keeping your spending in check!</td></tr>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Expense Summary</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 30px 15px;">
    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 26px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Daily Spending Summary</h1>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">${date || new Date().toISOString().split('T')[0]}</p>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Hello, ${name || 'User'} 👋</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          Here is your daily expense breakdown:
        </p>

        <!-- Summary Metric Card -->
        <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 16px; margin: 18px 0; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; font-weight: 500; color: #991b1b;">Total Spent Today:</span>
          <span style="font-size: 20px; font-weight: 700; color: #dc2626;">${currency} ${Number(totalExpense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>

        <!-- Table -->
        <div style="overflow-x: auto; margin-top: 20px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">#</th>
                <th style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Name</th>
                <th style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Category</th>
                <th style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
            </tbody>
          </table>
        </div>
      </div>
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 20px; text-align: center; color: #94a3b8; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Money Manager Team. Track smarter, save better.
      </div>
    </div>
  </body>
  </html>
  `;
};
