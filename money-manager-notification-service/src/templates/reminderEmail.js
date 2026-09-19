export const getReminderEmailHtml = ({ name, appUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Finance Reminder</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 30px 15px;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 26px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Daily Money Reminder 💰</h1>
      </div>
      <div style="padding: 28px;">
        <h2 style="color: #1e293b; font-size: 19px; margin-top: 0;">Hi ${name || 'there'},</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Have you logged all your incomes and expenses for today? Keeping your records fresh gives you accurate insights into your daily cash flow.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${appUrl || '#'}" 
             style="background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 26px; font-size: 15px; font-weight: 600; border-radius: 8px; display: inline-block;">
            Log Today's Transactions
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center;">
          Consistency is the secret to mastering your finances! ✨
        </p>
      </div>
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 20px; text-align: center; color: #94a3b8; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Money Manager Team.
      </div>
    </div>
  </body>
  </html>
  `;
};
