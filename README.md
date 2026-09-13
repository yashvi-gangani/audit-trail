# AuditTrail Enterprise (Group Project)

### Event-Sourced Inventory & Logistics Ledger

AuditTrail is an enterprise-oriented inventory and logistics tracking system built around an **event-sourced architecture**. It maintains shipment history through immutable events and provides operational visibility through shipment querying, anomaly/risk detection, shipment tracking, and analytics.

The project is designed to provide a reliable audit trail for logistics operations where shipment state, historical events, anomalies, and operational metrics need to remain traceable and explainable.

---

## 🚀 Project Overview

Traditional logistics systems often store only the current state of a shipment. This makes it difficult to answer questions such as:

* What happened to a shipment?
* When did its status change?
* Where was it previously located?
* Did the shipment experience abnormal conditions?
* Which shipments are currently at risk?
* How many shipments are in transit?
* How many shipments have temperature problems?
* What is the average shipment duration?

AuditTrail addresses these problems by maintaining shipment information together with an event history and providing a dashboard for monitoring and analysis.

---

## ✨ Features Implemented

### 1. Event-Sourced Shipment Tracking

The system stores shipment-related events and uses them to maintain a queryable shipment state.

Each shipment can have a history of events such as:

* Shipment creation
* Status changes
* Location updates
* Temperature updates
* Arrival
* Other shipment-related activities

This provides an auditable history instead of relying only on the latest shipment state.

---

### 2. Shipment Querying

The system provides APIs for retrieving shipment information.

Users can:

* View all shipments
* View an individual shipment
* View shipment event history
* Search shipments
* Filter shipment information
* Select a shipment from the dashboard

---

### 3. Shipment Search & Filtering

The dashboard includes a shipment search workflow that allows users to find shipments more easily.

The search interface works together with the shipment table so that selecting a shipment displays its corresponding details.

---

### 4. Shipment Selection Workflow

The dashboard has a shared shipment-selection workflow.

A shipment can be selected by:

* Selecting it through the search interface
* Clicking its row in the shipment table

When a shipment is selected, the dashboard displays its details and historical information.

Refreshing the dashboard also clears the previously selected shipment so that stale shipment details are not displayed.

---

### 5. Shipment Anomaly & Risk Detection

AuditTrail includes deterministic and explainable shipment risk detection.

The system evaluates shipment conditions and assigns one of three risk levels:

* 🟢 **LOW**
* 🟡 **MEDIUM**
* 🔴 **HIGH**

The risk assessment also provides reasons explaining why a shipment received its risk level.

#### Current Risk Rules

| Condition                                        | Risk                 |
| ------------------------------------------------ | -------------------- |
| Temperature below 2°C                            | HIGH                 |
| Temperature above 8°C                            | HIGH                 |
| IN_TRANSIT for more than 72 hours                | MEDIUM               |
| No recent shipment update for more than 24 hours | MEDIUM               |
| Missing current location while IN_TRANSIT        | Explanation is added |

Higher-priority conditions can override lower-priority conditions.

For example, if a shipment has an unsafe temperature and has also been in transit for too long, it remains **HIGH risk**.

The system does not simply return a risk score; it also provides an explanation through the `reasons` field.

Example:

```json
{
  "riskLevel": "HIGH",
  "reasons": [
    "Temperature is outside the safe range of 2°C to 8°C"
  ]
}
```

---

### 6. Shipment Analytics & KPIs

The dashboard now provides operational shipment statistics.

Current KPI cards include:

* **Total Shipments**
* **In Transit**
* **Delivered**
* **High Risk**
* **Temperature Issues**
* **Average Shipment Duration**

The dashboard also provides a **Status Overview** showing the number of shipments grouped by status.

Analytics are calculated from shipment data and enriched with the same risk-detection logic used by individual shipment queries.

---

## 📊 Current Dashboard

The dashboard provides a centralized view containing:

```text
┌─────────────────────────────────────────────────────┐
│                 Shipment Analytics                  │
├──────────────┬──────────────┬──────────────┬────────┤
│ Total        │ In Transit   │ Delivered    │ High   │
│ Shipments    │              │              │ Risk   │
├──────────────┴──────────────┴──────────────┴────────┤
│ Temperature Issues     │ Average Duration            │
├────────────────────────┴─────────────────────────────┤
│ Status Overview                                     │
├─────────────────────────────────────────────────────┤
│ Search Shipments                                    │
├─────────────────────────────────────────────────────┤
│ Shipment Table                                      │
├─────────────────────────────────────────────────────┤
│ Selected Shipment Details                           │
├─────────────────────────────────────────────────────┤
│ Risk Analysis                                       │
├─────────────────────────────────────────────────────┤
│ Event History / Timeline                            │
└─────────────────────────────────────────────────────┘
```

---

# 🏗️ Architecture

The project follows a backend/frontend architecture with separate command/event and query responsibilities.

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      Express API     │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Query Layer       Risk Detection     Event Layer
             │                 │                 │
             ▼                 ▼                 ▼
      Shipment Read      Risk Assessment     Events
         Model                               
             │
             ▼
          MongoDB
```

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* CSS
* React components
* Fetch API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs

## Security & Middleware

The backend also uses middleware/components for areas such as:

* Helmet
* CORS
* Morgan
* MongoDB sanitization
* Rate limiting
* Centralized error handling

---

# 📁 Project Structure

```text
audit-trail/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── queries/
│   │   │   └── shipmentQueries.js
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── shipmentRiskService.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   └── EventTimeline.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── AuditDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🔌 API Endpoints

The backend exposes REST APIs for shipment querying.

### Get All Shipments

```http
GET /api/queries/shipments
```

Returns the available shipment records.

---

### Get Shipment by ID

```http
GET /api/queries/shipments/:id
```

Returns information about a specific shipment.

---

### Get Shipment History

```http
GET /api/queries/shipments/:id/history
```

Returns the event history associated with a shipment.

---

### Get Shipment Statistics

```http
GET /api/queries/shipments/stats
```

Returns shipment analytics.

Example response:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "byStatus": {
      "ARRIVED": 2
    },
    "byRisk": {
      "HIGH": 2
    },
    "temperatureIssues": 2,
    "inTransit": 0,
    "averageShipmentDurationHours": 0
  }
}
```

---

# 📈 Analytics Calculation

The statistics endpoint calculates:

### Total Shipments

```text
Total = number of shipments
```

### Status Distribution

Shipments are grouped according to their current status.

Example:

```json
{
  "ARRIVED": 2,
  "IN_TRANSIT": 3
}
```

### Risk Distribution

Each shipment is evaluated using the shipment risk service.

Example:

```json
{
  "HIGH": 2,
  "MEDIUM": 1,
  "LOW": 4
}
```

### Temperature Issues

A shipment is counted as having a temperature issue when:

```text
temperature < 2°C
OR
temperature > 8°C
```

### Average Shipment Duration

For shipments containing both `createdAt` and `arrivedAt`:

```text
duration = arrivedAt - createdAt
```

The result is converted into hours and rounded to two decimal places.

---

# 🧠 Risk Detection Architecture

Risk detection is separated into its own service:

```text
shipmentRiskService.js
```

The service exposes:

```javascript
assessShipmentRisk()
assessShipmentsRisk()
```

This separation keeps risk logic independent from the query layer.

The same risk logic can therefore be reused by:

* Shipment list queries
* Shipment detail queries
* Analytics
* Dashboard risk display

This avoids having different risk calculations in different parts of the application.

---

# 🖥️ Frontend Data Flow

The dashboard obtains shipment information through the API service.

```text
React Dashboard
      │
      ├── getShipments()
      │
      ├── getShipmentById()
      │
      ├── getShipmentHistory()
      │
      └── getShipmentStats()
               │
               ▼
        Express Backend
               │
               ▼
          Query Layer
               │
               ▼
        Shipment Read Model
```

The statistics endpoint is consumed through:

```javascript
getShipmentStats()
```

from:

```text
frontend/src/services/api.js
```

---

# ⚙️ Local Development

## 1. Clone the Repository

```bash
git clone <repository-url>
cd audit-trail
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Start Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5001
```

---

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 5. Start Frontend

```bash
npm run dev
```

Vite will provide the local frontend URL.

---

# 🧪 Testing the Statistics API

After starting the backend, the statistics endpoint can be tested using:

```bash
curl http://localhost:5001/api/queries/shipments/stats
```

Example:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "byStatus": {
      "ARRIVED": 2
    },
    "byRisk": {
      "HIGH": 2
    },
    "temperatureIssues": 2,
    "inTransit": 0,
    "averageShipmentDurationHours": 0
  }
}
```

---

# 🏭 Enterprise Use Cases

AuditTrail is designed around use cases where traceability and explainability are important.

Potential applications include:

* Supply-chain monitoring
* Pharmaceutical logistics
* Cold-chain shipment monitoring
* Warehouse inventory tracking
* Regulated logistics operations
* Shipment auditing
* Operational risk monitoring

---

# 🔐 Design Principles

### Event-Based Traceability

Shipment changes are represented through events, allowing historical activity to remain traceable.

### Explainable Risk Detection

Risk levels are generated using explicit rules rather than unexplained black-box predictions.

### Separation of Concerns

Querying, risk assessment, API handling, and UI responsibilities are kept separate.

### Operational Visibility

The dashboard provides both shipment-level information and high-level KPIs.

### Reusable Services

Risk detection is implemented as a reusable backend service rather than duplicating the logic across endpoints.

---

# 📌 Current Project Status

## Completed

* [x] Backend foundation
* [x] Shipment query functionality
* [x] Shipment search
* [x] Shipment filtering
* [x] Shipment detail view
* [x] Shipment event history
* [x] Shipment selection workflow
* [x] Shipment anomaly detection
* [x] Explainable shipment risk levels
* [x] Temperature anomaly detection
* [x] In-transit duration risk detection
* [x] Stale shipment update detection
* [x] Missing location detection
* [x] Shipment risk display in dashboard
* [x] Shipment analytics API
* [x] KPI cards
* [x] Status overview
* [x] Average shipment duration calculation
* [x] Temperature issue statistics
* [x] Risk distribution statistics
* [x] Frontend production build verification

---

# 🚧 Future Enhancements

Potential next improvements include:

* Real-time shipment updates
* Advanced analytics and charts
* Shipment trend visualization
* Location/map tracking
* Advanced anomaly detection
* Alert notifications
* Role-based access control
* Audit log visualization
* AI-assisted shipment insights
* Predictive shipment risk
* Exportable reports
* Advanced filtering by date/location/status/risk
* Production deployment
* Automated testing

---

# 👥 Project

**AuditTrail Enterprise AI**

**Event-Sourced Inventory & Logistics Ledger**

Built as an enterprise logistics tracking and auditability platform with a focus on **event sourcing, shipment traceability, explainable anomaly detection, and operational analytics**.
