import express from 'express';
import { exportExcelReport, exportPdfReport } from '../controllers/reportController.js';

const router = express.Router();

router.post('/export/excel', exportExcelReport);
router.post('/export/pdf', exportPdfReport);

export default router;
