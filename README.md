# AuditTrail — Event-Sourced Inventory & Logistics Ledger

AuditTrail is an enterprise-style inventory and logistics tracking platform built around **event sourcing, immutable audit trails, real-time shipment monitoring, analytics, alerts, and AI-assisted insights**.

The system records shipment and container events as an append-only history and reconstructs the current state by replaying those events. This provides traceability, auditability, and a reliable history of operational changes.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API routes
* Session management
* Role-based access support

### 📦 Shipment & Logistics Management

* Create and manage shipments
* Track shipment status
* View shipment details
* Monitor shipment lifecycle
* Shipment event history
* Real-time shipment updates

### 🧾 Event-Sourced Audit Trail

AuditTrail maintains an immutable event history for operational activities.

Example event lifecycle:
CONTAINER_CREATED
        ↓
LOADED_ON_SHIP
        ↓
TEMPERATURE_SPIKE
        ↓
ARRIVED_AT_PORT

The current shipment state can be reconstructed by replaying the stored events.

### 🔄 Event Replay & State Reconstruction

* Event reducers
* Event replay engine
* Shipment state reconstruction
* Historical state inspection
* State scrubbing / historical state navigation

### 📊 Analytics & Dashboard

* Shipment statistics
* Operational analytics
* Shipment status distribution
* Temperature monitoring
* Dashboard metrics
* Analytics visualizations

### 🚨 Alerts & Notifications

* Alert rules
* Operational alerts
* Shipment-related notifications
* Real-time alert handling

### 🤖 AI-Powered Features

* AI-assisted shipment insights
* Shipment risk analysis
* AI-generated operational insights
* AI-related controllers and services

### 📈 Reports & Audit Logs

* Audit log management
* Operational reports
* Historical event tracking
* Searchable audit information

### ⚡ Real-Time Communication

* Socket.IO integration
* Real-time shipment updates
* Real-time notifications
* Server-side socket handlers

---

## 🏗️ Project Architecture

The project is divided into two main applications:
AuditTrail/
│
├── client/                 # React frontend
│
├── server/                 # Node.js + Express backend
│
├── .gitignore
├── README.md
└── render.yaml

---

## 💻 Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* Zustand
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT
* bcryptjs
* Joi
* Helmet
* Express Rate Limit
* Morgan

### AI

* Google Generative AI

### Development

* Git
* GitHub
* Nodemon
* Vite

---

## 📁 Client Structure
client/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── ui/
│   │       ├── Modal.jsx
│   │       ├── SeverityBadge.jsx
│   │       ├── Skeleton.jsx
│   │       ├── StatCard.jsx
│   │       └── Toast.jsx
│   │
│   ├── hooks/
│   │   └── useSocket.js
│   │
│   ├── pages/
│   │   ├── AIInsightsPage.jsx
│   │   ├── AlertsPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── AuditLogsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── ShipmentsPage.jsx
│   │   ├── StateScrubberPage.jsx
│   │   ├── TimelinePage.jsx
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── shipmentStore.js
│   │   └── uiStore.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── vite.config.js

---

## 📁 Server Structure
server/
│
├── src/
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── alertsController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── commandController.js
│   │   ├── ingestController.js
│   │   ├── logsController.js
│   │   ├── queryController.js
│   │   └── shipmentAIController.js
│   │
│   ├── engine/
│   │   ├── eventReducers.js
│   │   └── eventReplay.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   ├── AlertRule.js
│   │   ├── AuditLog.js
│   │   ├── EventStore.js
│   │   ├── Notification.js
│   │   ├── Session.js
│   │   ├── Shipment.js
│   │   └── User.js
│   │
│   ├── projections/
│   │   └── shipmentProjector.js
│   │
│   ├── routes/
│   │   ├── ai.js
│   │   ├── alerts.js
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── ingest.js
│   │   ├── logs.js
│   │   ├── commands/
│   │   │   └── shipments.js
│   │   └── queries/
│   │       └── shipments.js
│   │
│   ├── scripts/
│   │   ├── seed.js
│   │   └── seedDemo.js
│   │
│   └── socket/
│       └── socketHandlers.js
│
├── server.js
├── package.json
└── Procfile

---

## 🔄 Event-Sourcing Flow

AuditTrail follows an event-driven architecture:
User / System Action
        │
        ▼
   Command API
        │
        ▼
   Event Created
        │
        ▼
   Event Store
        │
        ├───────────────► Audit History
        │
        ▼
   Event Replay / Reducer
        │
        ▼
 Current Shipment State
        │
        ▼
   Read / Query APIs
        │
        ▼
      Client

The event store acts as the historical source of truth, while projections provide convenient read models for the application.

---

## 🛠️ Installation

### 1. Clone the repository
git clone https://github.com/yashvi-gangani/audit-trail.git
cd audit-trail

---

### 2. Install Client Dependencies
cd client
npm install

---

### 3. Install Server Dependencies

Open another terminal:
cd server
npm install

---

## ▶️ Running the Application

### Start Backend
cd server
npm run dev


The backend will start using Nodemon.

### Start Frontend

In another terminal:
cd client
npm run dev

The Vite development server will provide the frontend URL in the terminal.

---

## 🌱 Database Seeding

To run the standard seed:
cd server
npm run seed

For demo data:
npm run seed:demo


Only run seed commands when you intentionally want to populate/reset the corresponding development data.

---

## 📡 Real-Time Updates

AuditTrail uses **Socket.IO** for real-time communication.

Real-time functionality can be used for:

* Shipment updates
* Alerts
* Notifications
* Operational events
* Dashboard updates

---

## 🧠 AI Architecture

AI functionality is separated from the core event-sourcing mechanism.

The backend contains dedicated AI controllers for:
AI Insights
     │
     ├── Shipment Analysis
     ├── Risk Analysis
     └── Operational Insights

The core shipment history remains event-driven and independently auditable.

---

## 🔒 Security

The application includes several security mechanisms:

* JWT authentication
* Password hashing with bcrypt
* Protected routes
* Rate limiting
* Helmet security headers
* Input validation using Joi
* MongoDB sanitization
* Environment-variable based secrets

---

## 📊 Core Concepts

### Event Store

Stores operational events as historical records.

### Event Replay

Replays events in sequence to reconstruct the state of an entity.

### Reducer

Applies an event to the previous state and produces the next state.

### Projection

Creates query-friendly representations of event-driven data.

### Audit Log

Provides a record of important application and operational activities.

---

## 🧪 Development

### Frontend
cd client
npm run dev

### Backend
cd server
npm run dev


### Production Backend
cd server
npm start

---

## 🚀 Deployment

The backend includes a `Procfile` for deployment environments that support it.

Before deployment:

1. Configure production environment variables.
2. Configure MongoDB.
3. Configure the frontend API URL.
4. Configure CORS.
5. Add required AI API credentials.
6. Build and deploy the frontend.
7. Deploy the backend.

Never expose production secrets in the repository.

---

## 👥 Project

**AuditTrail — Event-Sourced Inventory & Logistics Ledger**

Built as a collaborative enterprise application using modern full-stack technologies, event sourcing, real-time communication, analytics, and AI-assisted functionality.

