# 🛡 AuditTrail Enterprise AI

> AI-powered audit trail, compliance monitoring, and anomaly detection platform.

![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/Node.js-Express-green) ![Stack](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Stack](https://img.shields.io/badge/AI-Gemini-purple)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Server Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key
npm run seed    # Seed demo data (500 logs + users)
npm run dev     # Start server on :5001 (see server/.env PORT)
```

### 2. Client Setup

```bash
cd client
npm install
npm run dev     # Start on :5173
```

### 3. Login

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@audittrail.io      | admin123     |
| Auditor | sarah@audittrail.io      | auditor123   |
| Viewer  | marcus@audittrail.io     | viewer123    |

---

## 🤖 AI Features (Gemini)

Add your key to `server/.env`:
```
GEMINI_API_KEY=your_key_here
```
Get a key at https://aistudio.google.com/

Without a key, statistical analysis still works fully.

---

## 📡 Ingest API

Send audit events from any service:

```bash
curl -X POST http://localhost:5001/api/ingest \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[{"userId":"u1","userName":"John","action":"LOGIN","resource":"Session","severity":"INFO","status":"SUCCESS"}]'
```

---

## 🏗 Architecture

```
client/          React + Vite frontend (port 5173)
server/          Node.js + Express backend (port 5001)
  ├── models/    MongoDB schemas
  ├── routes/    API endpoints
  ├── controllers/
  ├── services/  AI + alert engine
  └── socket/    Socket.IO real-time events
```

---

## ✨ Features

- **Real-time log streaming** via Socket.IO
- **AI anomaly detection** — off-hours access, bulk deletes, privilege escalation
- **Natural language queries** — "Show failed logins from yesterday"
- **Executive summaries** — AI-generated compliance reports
- **User risk scoring** — behavioral risk calculation
- **Alert rules** — configurable threshold-based alerts
- **Activity heatmap** — hour × day-of-week visualization
- **SOC 2, GDPR, ISO 27001** report templates
- **Role-based access** — Admin, Auditor, Viewer
- **Event ingestion API** with API key auth

---

## 🔧 Audit fixes applied to this build

A few real bugs were found and fixed against the PDF's Project 2 spec:

1. **`routes/ingest.js` crashed on API-key auth.** It imported `apiKeyMiddleware` from `middleware/auth.js`, but that function never existed — any external system posting to `/api/ingest` with an `X-API-Key` header (rather than a Bearer token) would hit `TypeError: apiKeyMiddleware is not a function`. Added a real implementation that looks the user up by their stored `apiKey`.
2. **`requireRole('admin', 'auditor')` silently dropped the second role.** The factory only accepted a single array argument (`requireRole(['admin','manager'])`), but `routes/alerts.js` and `routes/logs.js` called it with two separate string arguments instead. Since the function only ever saw the first argument, `auditor` was quietly excluded — auditors couldn't create/update alert rules or flag logs even though the code clearly intended them to. `requireRole` now accepts both calling styles.
3. **No seeded user actually had the `auditor` role.** Sarah Chen's demo account had `password: 'auditor123'` but `role: 'manager'` in both seed scripts — so the `auditor`-only permission paths (fixed in #2) had no demo account to test them with. Fixed her role to `auditor`, matching her password and the README's login table.
4. **Port mismatch in this README** (said `:5000`, `.env`/`.env.example` actually default to `5001`) — corrected above.

Everything else — CQRS command/query split, the append-only Event Store with immutability guards, optimistic concurrency control via `expectedVersion`, the read-model projector, state-scrubbing/rollback, and the Recharts temperature overlay — was already implemented correctly.

## 🤖 New AI features added (shipment domain)

The existing Gemini-powered AI page (`/ai-insights`) is well built, but every feature on it — natural language query, anomaly detection, executive summaries, risk scores — analyzes the **AuditLog** collection (who logged in, who deleted what). None of it actually looks at the **event-sourced shipment ledger** the PDF's "Audit Trail" project is about. Three new features close that gap, added as `server/src/controllers/shipmentAIController.js` and a new "Shipment Intelligence" panel at the top of the AI Insights page:

1. **Shipment Anomaly Detection** — cold-chain temperature excursions, rapid temperature swings (possible sensor fault or an opened door), stalled shipments with no recent events, hazmat-specific severity escalation, and past-due deliveries.
2. **Delay-Risk Prediction** — a 0–100 heuristic score (LOW/MEDIUM/HIGH) built from event-derived signals: current status, temperature alert count, whether the ETA has already passed, hazmat cargo, and event activity relative to shipment age.
3. **AI Narrative** — a natural-language summary of a shipment's full event history. Uses the same Gemini pattern as the rest of the app when `GEMINI_API_KEY` is set, and automatically falls back to a deterministic local template when it isn't — the feature never breaks for someone without a key.

All three are combined behind one call: `GET /api/ai/shipments/:id/insights` (JWT-protected, same as the rest of `/api/ai`). Try it against the seeded demo shipments — `SHP-DEMO-003` has a real temperature excursion (16.8°C) and a `DELAYED` status, so it's the one that shows every feature lighting up.

## 🔧 Round 2 fixes

1. **Rate limiter was blocking normal local testing.** `generalLimiter`/`authLimiter`/`commandLimiter` now `skip()` entirely when `NODE_ENV !== 'production'` — full enforcement is preserved in production, but a long local testing session (multiple tabs, React StrictMode double-firing effects) will no longer lock you out with "Too many requests." If you restart the dev server and still see the message, you're likely running with `NODE_ENV=production` set somewhere in your shell — check with `echo $NODE_ENV`.
2. **The Gemini banner on `/ai-insights` always said "add your API key," even after you'd added a real one.** It was a hardcoded string, not tied to any actual check. Added `GET /api/ai/status` (checks whether `GEMINI_API_KEY` is set and the SDK initializes) and wired the banner to call it — it now correctly shows either "Gemini AI is active — running on gemini-1.5-flash" or "Gemini AI is not configured," live.
3. **`.alert-banner` CSS class didn't exist.** The banner above was rendering with zero styling (no background/border color) because `global.css` never defined `.alert-banner` or its `.info`/`.success`/`.warning`/`.critical` variants. Added them, using the app's existing theme variables so it respects light/dark mode.
4. Fixed the same `:5000` → `:5001` port typo on the Settings → API Keys tab's curl example (README already had this fixed from round 1).

## 🗄️ Connecting your own MongoDB

The project ships with a shared demo Atlas cluster in `server/.env` so it runs out of the box. To point it at your own database instead:

**Option A — MongoDB Atlas (free tier, recommended)**
1. Go to https://cloud.mongodb.com → create a free account/cluster (M0 tier).
2. Database Access → add a database user (username + password).
3. Network Access → add IP `0.0.0.0/0` (allow from anywhere) for local dev, or your current IP.
4. Clusters → Connect → "Drivers" → copy the connection string, e.g.:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/audittrail?retryWrites=true&w=majority`
5. Paste it into `server/.env` as `MONGODB_URI=...` (replace `<username>`/`<password>` with your real values, URL-encode any special characters in the password).
6. Restart the server: `npm run dev`. On first connect to an empty database it auto-seeds demo users, shipments, alert rules and audit logs (see `src/scripts/seedDemo.js`).

**Option B — Local MongoDB**
1. Install MongoDB Community Server, then run `mongod` (or `brew services start mongodb-community` on macOS).
2. Set `MONGODB_URI=mongodb://127.0.0.1:27017/audittrail` in `server/.env`.
3. `npm run dev` — same auto-seed behavior.

**Option C — In-memory (no install, no account, non-persistent)**
Set `MONGODB_URI=memory` in `server/.env`. Uses `mongodb-memory-server`, which downloads a real `mongod` binary on first run (needs internet access once) and keeps everything in RAM — perfect for offline demos, but data is lost when the server stops.

Either way, once connected you own the data — the seed script only runs when the `User` collection is empty, so it won't touch a database that already has data in it.


