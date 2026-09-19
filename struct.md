# 🏗️ Money Manager Application — Architecture & Microservices Structure

This document details the overall repository structure, architecture, and a complete step-by-step guide on how the **Node.js Microservice** was designed, added, and integrated with the **Spring Boot backend** and **React frontend**.

---

## 📂 1. Repository Structure

```
MoneyManagerApplication/
├── Money-manger/                          # 🎨 Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/                   # UI components (Dashboard, Forms, Modals)
│   │   ├── context/                      # State management
│   │   ├── hooks/                        # Custom React hooks (useUser, etc.)
│   │   ├── pages/                        # Page views (Dashboard, Income, Expense, Filter, Login, Signup)
│   │   ├── util/
│   │   │   ├── apiEndpoints.js           # API routes mapping
│   │   │   └── axiosConfig.jsx           # Axios interceptors with JWT injection
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── MoneyManagerApplication/              # ☕ Primary Backend (Spring Boot 3 + Java 21)
│   ├── src/main/java/com/danny/MoneyManagerApplication/
│   │   ├── client/                       # 🔌 Service-to-Service Clients
│   │   │   └── NotificationServiceClient.java  # Communicates with Node.js Microservice
│   │   ├── config/                       # Spring Security & App configs
│   │   ├── controller/                   # REST Controllers (Profile, Income, Expense, Dashboard, Report)
│   │   ├── DTO/                          # Data Transfer Objects
│   │   ├── entity/                       # JPA Database Entities (Profile, Income, Expense, Category)
│   │   ├── repository/                   # Spring Data JPA Repositories
│   │   ├── security/                     # JWT filter & auth tokens
│   │   ├── service/                      # Core business logic & schedulers
│   │   └── MoneyManagerApplication.java  # Main entry point (@EnableScheduling)
│   ├── src/main/resources/
│   │   └── application.properties        # App properties & microservice configs
│   ├── pom.xml
│   └── .env
│
├── money-manager-notification-service/   # 🚀 Microservice (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── mail.js                   # Nodemailer configuration & mock fallback
│   │   ├── controllers/
│   │   │   ├── notificationController.js # Email trigger handlers
│   │   │   └── reportController.js       # Excel & PDF generation handlers
│   │   ├── middleware/
│   │   │   └── authMiddleware.js         # X-Service-API-Key security verification
│   │   ├── routes/
│   │   │   ├── notificationRoutes.js     # /api/v1/notify endpoints
│   │   │   └── reportRoutes.js           # /api/v1/reports endpoints
│   │   ├── templates/                    # Responsive HTML email templates
│   │   │   ├── activationEmail.js        # Account activation email
│   │   │   ├── reminderEmail.js          # Daily 10 PM expense reminder
│   │   │   └── dailySummaryEmail.js      # Daily 11 PM expense breakdown table
│   │   └── server.js                     # Express app setup & health check (/health)
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── README.md                             # Project overview
└── struct.md                             # Architectural documentation (this file)
```

---

## 🏛️ 2. Microservice Architecture & Communication Flow

```
                      +-----------------------------+
                      | React Frontend (:5173)     |
                      +-----------------------------+
                                     |
                          Authenticated Requests
                                     v
                      +-----------------------------+
                      | Spring Boot Backend (:8080) |
                      | - Authentication (JWT)      |
                      | - Financial Ledger (ACID)   |
                      | - Categories & Dashboard    |
                      +-----------------------------+
                                     |
             Delegation via REST     |  X-Service-API-Key
             (Internal Network)      v
                      +-----------------------------+
                      | Node.js Microservice (:5001)|
                      | - Email Dispatch (Nodemailer|
                      | - HTML Email Templates      |
                      | - Excel (.xlsx) Generation  |
                      | - PDF Statement Generation  |
                      +-----------------------------+
                                     |
                                     v
                           [ SMTP Mail Server ]
                       (Gmail / SendGrid / Console)
```

### Why Separate Node.js from Spring Boot?
1. **Separation of Concerns**: Spring Boot handles core ACID banking ledger transactions and relational data integrity. Node.js handles I/O-heavy, asynchronous email rendering and document generation.
2. **Superior Templating**: HTML emails with complex tables and styling are much easier and cleaner to maintain in JavaScript/HTML templates than Java string concatenation.
3. **Non-blocking Workers**: Heavy PDF rendering and bulk email loops won't tie up Spring Boot's request worker thread pool.

---

## 🪜 3. Step-by-Step Guide: How the Node.js Microservice Was Added

Follow these exact steps if you want to understand how it was built or replicate this in other projects:

### Step 1: Initialize the Node.js Microservice
1. Create a dedicated folder at the workspace root:
   ```bash
   mkdir money-manager-notification-service
   cd money-manager-notification-service
   ```
2. Initialize `package.json` with ES Modules (`"type": "module"`):
   ```json
   {
     "name": "money-manager-notification-service",
     "version": "1.0.0",
     "main": "src/server.js",
     "type": "module",
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch src/server.js"
     }
   }
   ```
3. Install the required microservice dependencies:
   ```bash
   npm install express cors dotenv nodemailer exceljs pdfkit
   ```
   * `express`: Fast, unopinionated web server.
   * `cors`: Cross-Origin Resource Sharing middleware.
   * `dotenv`: Environment variable loader.
   * `nodemailer`: SMTP email transport.
   * `exceljs`: Spreadsheet workbook generation.
   * `pdfkit`: Bank-grade PDF statement creation.

---

### Step 2: Configure Environment & Mail Transport
1. Create `.env` in `money-manager-notification-service/`:
   ```env
   PORT=5001
   SERVICE_API_KEY=money_manager_secret_key_2026

   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=
   SMTP_PASS=
   FROM_EMAIL=no-reply@moneymanager.com
   FROM_NAME=Money Manager
   ```
2. Create `src/config/mail.js` to create the Nodemailer transporter:
   * **Smart Fallback**: If SMTP credentials are left blank during local development, it logs a clean email preview to the terminal so the server never crashes.

---

### Step 3: Implement Security & HTML Templates
1. Create `src/middleware/authMiddleware.js`:
   * Validates the `X-Service-API-Key` header on all protected microservice routes.
   * Allows public access to `/health`.
2. Create modular HTML email templates under `src/templates/`:
   * `activationEmail.js`: User welcome and account activation link button.
   * `reminderEmail.js`: Daily 10:00 PM prompt encouraging users to record expenses.
   * `dailySummaryEmail.js`: Daily 11:00 PM summary containing an HTML table of today's expenses.

---

### Step 4: Build Controllers & Routes in Node.js
1. **Notification Controller** (`src/controllers/notificationController.js`):
   * `POST /api/v1/notify/activation`: Accepts `{ email, fullName, activationUrl }` and sends activation email.
   * `POST /api/v1/notify/reminder`: Accepts `{ email, fullName, appUrl }` and dispatches reminder email.
   * `POST /api/v1/notify/summary`: Accepts `{ email, fullName, date, expenses, totalExpense }` and sends summary digest.
2. **Report Controller** (`src/controllers/reportController.js`):
   * `POST /api/v1/reports/export/excel`: Takes transaction data and streams an `.xlsx` workbook.
   * `POST /api/v1/reports/export/pdf`: Takes transaction data and streams an A4 PDF statement.
3. Connect all routes in `src/server.js` and start Express on port `5001`.

---

### Step 5: Connect Spring Boot to the Microservice
1. **Configure Spring Boot** (`MoneyManagerApplication/src/main/resources/application.properties`):
   ```properties
   # Node.js Notification Microservice
   microservice.notification.url=${NOTIFICATION_SERVICE_URL:http://localhost:5001}
   microservice.notification.api-key=${NOTIFICATION_SERVICE_KEY:money_manager_secret_key_2026}
   ```
2. **Create REST Client** (`com.danny.MoneyManagerApplication.client.NotificationServiceClient.java`):
   * Uses Spring's `RestTemplate` with the `X-Service-API-Key` header.
   * Contains methods: `sendActivationEmail()`, `sendReminderEmail()`, `sendDailyExpenseSummary()`, `generateExcelReport()`, and `generatePdfReport()`.
3. **Update Services**:
   * In `ProfileService.java`: In `registerProfile()`, call `notificationServiceClient.sendActivationEmail(...)` with fallback to local `EmailService`.
   * In `NotificationService.java`: Schedule daily reminder (10 PM) and daily summary (11 PM) using `@Scheduled` and dispatch payloads to Node.js.
   * In `ReportController.java`: Provide a clean REST endpoint (`GET /api/v1.0/report/export?type=all&format=excel`) that collects ledger transactions and streams the file from Node.js back to the browser.

---

### Step 6: Frontend Integration
1. In `Money-manger/src/util/apiEndpoints.js`, register the endpoints:
   ```javascript
   EXPORT_REPORT: "/report/export",
   FILTER: "/filter",
   ```
2. Users can trigger statement downloads or filter queries directly from the UI.

---

## 🧪 4. Testing & Verification

| Test | Method & Endpoint | Sample Payload / Command | Result |
| :--- | :--- | :--- | :--- |
| **Health Check** | `GET http://localhost:5001/health` | None | `{"status":"UP","service":"money-manager-notification-service"}` |
| **Activation Email** | `POST http://localhost:5001/api/v1/notify/activation` | `{"email":"test@user.com","fullName":"John","activationUrl":"http://..."}` | `200 OK`, email dispatched |
| **Unauthorized Block** | `POST http://localhost:5001/api/v1/notify/activation` | No `X-Service-API-Key` | `401 Unauthorized` |
| **Excel Export** | `POST http://localhost:5001/api/v1/reports/export/excel` | `{"transactions":[...]}` | Returns binary `.xlsx` stream |
| **PDF Export** | `POST http://localhost:5001/api/v1/reports/export/pdf` | `{"transactions":[...]}` | Returns binary `.pdf` stream |

---

## 🚀 5. How to Run the Entire System

Open 3 terminal tabs:

### Tab 1: Start Node.js Microservice
```bash
cd money-manager-notification-service
npm run dev
# Runs on: http://localhost:5001
```

### Tab 2: Start Spring Boot Backend
```bash
cd MoneyManagerApplication
./mvnw.cmd spring-boot:run
# Runs on: http://localhost:8080/api/v1.0
```

### Tab 3: Start React Frontend
```bash
cd Money-manger
npm run dev
# Runs on: http://localhost:5173
```
