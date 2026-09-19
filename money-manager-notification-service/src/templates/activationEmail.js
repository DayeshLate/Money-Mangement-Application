export const getActivationEmailHtml = ({ name, activationUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your Account</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 30px 15px;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Money Manager</h1>
        <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Smart Financial Management</p>
      </div>
      <div style="padding: 32px 28px;">
        <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Welcome, ${name || 'User'}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Thank you for joining <strong>Money Manager</strong>. You're just one step away from taking full control of your finances.
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Please confirm your email address by clicking the activation button below:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${activationUrl}" 
             style="background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 15px; font-weight: 600; border-radius: 8px; display: inline-block; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);">
            Activate My Account
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; word-break: break-all;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${activationUrl}" style="color: #4f46e5;">${activationUrl}</a>
        </p>
      </div>
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; color: #94a3b8; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Money Manager Team. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
