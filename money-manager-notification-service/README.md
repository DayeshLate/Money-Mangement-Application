# 🚀 Money Manager Notification & Reporting Microservice

A dedicated Node.js microservice for asynchronous email dispatching, scheduled notifications, and document statement generation (PDF & Excel) for the Money Manager Application.

---

## 🛠 Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Email Delivery**: Nodemailer (HTML templates with responsive design)
- **Document Generation**: ExcelJS (Excel `.xlsx`), PDFKit (PDF statements)
- **Security**: Service-to-Service API Key authentication (`X-Service-API-Key`)

---

## ⚙️ Configuration (.env)

Create or update `.env` in this directory:

```env
PORT=5001
SERVICE_API_KEY=money_manager_secret_key_2026

# SMTP Mail Settings (e.g. Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME="Money Manager"
```

> **Note**: If `SMTP_USER` / `SMTP_PASS` are left empty, emails will gracefully log to console with a preview without crashing.

---

## 🏃‍♂️ Running the Microservice

```bash
# Navigate to the microservice directory
cd money-manager-notification-service

# Install dependencies
npm install

# Start in development mode (with hot reloading)
npm run dev

# Start in production mode
npm start
```

---

## 🔌 API Endpoints

### 1. Health Check (Public)
- **`GET /health`**
- Returns status and timestamp.

### 2. Notifications (Requires `X-Service-API-Key`)
- **`POST /api/v1/notify/activation`**
  - Sends styled account activation email with verification link.
  - Body: `{ "email": "...", "fullName": "...", "activationUrl": "..." }`
- **`POST /api/v1/notify/reminder`**
  - Sends daily reminder prompt to log expenses and income.
  - Body: `{ "email": "...", "fullName": "...", "appUrl": "..." }`
- **`POST /api/v1/notify/summary`**
  - Sends daily expense digest with an HTML table of transactions.
  - Body: `{ "email": "...", "fullName": "...", "date": "2026-09-19", "expenses": [...], "totalExpense": 450 }`

### 3. Reports & Statements (Requires `X-Service-API-Key`)
- **`POST /api/v1/reports/export/excel`**
  - Generates and streams a styled `.xlsx` workbook.
- **`POST /api/v1/reports/export/pdf`**
  - Generates and streams a formatted A4 PDF statement.
