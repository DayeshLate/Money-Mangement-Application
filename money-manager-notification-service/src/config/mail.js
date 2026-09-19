import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

export const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('[MailConfig] SMTP_USER or SMTP_PASS not defined. Outbound emails will log to console.');
    transporter = {
      sendMail: async (options) => {
        console.log('\n[MOCK EMAIL SENT]');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Content Preview: ${options.text || '(HTML Body)'}`);
        console.log('--------------------------------------------------\n');
        return { messageId: 'mock-' + Date.now(), response: 'Mock email logged to console' };
      }
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass }
  });

  return transporter;
};
