import dotenv from 'dotenv';

dotenv.config();

export const verifyServiceAuth = (req, res, next) => {
  const configuredKey = process.env.SERVICE_API_KEY || 'money_manager_secret_key_2026';
  const incomingKey = req.headers['x-service-api-key'] || req.headers['x-api-key'];

  // Allow public health checks and report downloads (if accessed with user token or public)
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  // If internal service API key is supplied and matches, proceed
  if (incomingKey && incomingKey === configuredKey) {
    return next();
  }

  // If no auth is provided or key mismatch
  return res.status(401).json({
    success: false,
    message: 'Unauthorized: Invalid or missing X-Service-API-Key header'
  });
};
