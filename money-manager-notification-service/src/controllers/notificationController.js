import { getTransporter } from '../config/mail.js';
import { getActivationEmailHtml } from '../templates/activationEmail.js';
import { getReminderEmailHtml } from '../templates/reminderEmail.js';
import { getDailySummaryEmailHtml } from '../templates/dailySummaryEmail.js';

export const sendActivationEmail = async (req, res) => {
  try {
    const { email, fullName, activationUrl } = req.body;

    if (!email || !activationUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email and activationUrl are required.'
      });
    }

    const transporter = getTransporter();
    const fromAddress = `"${process.env.FROM_NAME || 'Money Manager'}" <${process.env.FROM_EMAIL || 'no-reply@moneymanager.com'}>`;

    const htmlContent = getActivationEmailHtml({
      name: fullName,
      activationUrl
    });

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Activate your Money Manager account',
      html: htmlContent,
      text: `Welcome to Money Manager! Activate your account here: ${activationUrl}`
    });

    return res.status(200).json({
      success: true,
      message: 'Activation email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[NotificationController] Error sending activation email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send activation email',
      error: error.message
    });
  }
};

export const sendReminderEmail = async (req, res) => {
  try {
    const { email, fullName, appUrl } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: email is required.'
      });
    }

    const transporter = getTransporter();
    const fromAddress = `"${process.env.FROM_NAME || 'Money Manager'}" <${process.env.FROM_EMAIL || 'no-reply@moneymanager.com'}>`;

    const htmlContent = getReminderEmailHtml({
      name: fullName,
      appUrl: appUrl || process.env.FRONTEND_URL
    });

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Daily Reminder: Log your Income and Expenses',
      html: htmlContent,
      text: `Hi ${fullName || 'there'}, don't forget to log your daily expenses in Money Manager!`
    });

    return res.status(200).json({
      success: true,
      message: 'Reminder email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[NotificationController] Error sending reminder email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reminder email',
      error: error.message
    });
  }
};

export const sendDailySummaryEmail = async (req, res) => {
  try {
    const { email, fullName, date, expenses, totalExpense, currency } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: email is required.'
      });
    }

    const transporter = getTransporter();
    const fromAddress = `"${process.env.FROM_NAME || 'Money Manager'}" <${process.env.FROM_EMAIL || 'no-reply@moneymanager.com'}>`;

    const htmlContent = getDailySummaryEmailHtml({
      name: fullName,
      date,
      expenses,
      totalExpense,
      currency
    });

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `Your Daily Expense Summary - ${date || 'Today'}`,
      html: htmlContent,
      text: `Hi ${fullName || 'there'}, your total expense for today was ${currency || '₹'} ${totalExpense || 0}.`
    });

    return res.status(200).json({
      success: true,
      message: 'Daily summary email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[NotificationController] Error sending summary email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send summary email',
      error: error.message
    });
  }
};
