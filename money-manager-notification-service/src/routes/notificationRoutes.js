import express from 'express';
import {
  sendActivationEmail,
  sendReminderEmail,
  sendDailySummaryEmail
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/activation', sendActivationEmail);
router.post('/reminder', sendReminderEmail);
router.post('/summary', sendDailySummaryEmail);

export default router;
