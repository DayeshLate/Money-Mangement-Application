import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { verifyServiceAuth } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Service-API-Key', 'x-service-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (Public)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'money-manager-notification-service',
    timestamp: new Date().toISOString()
  });
});

// Protected Microservice Routes
app.use('/api/v1/notify', verifyServiceAuth, notificationRoutes);
app.use('/api/v1/reports', verifyServiceAuth, reportRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Money Manager Notification & Report Microservice is running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
});
