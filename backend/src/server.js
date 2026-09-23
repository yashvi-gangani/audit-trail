/**
 * AuditTrail Enterprise AI
 * Event-Sourced Inventory & Logistics Ledger
 */

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Rejection:", reason);
});

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

const commandRoutes = require("./routes/commands/shipments");
const queryRoutes = require("./routes/queryRoutes");

const { rebuildAllReadModels } = require("./projections/shipmentProjection");

const app = express();

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(generalLimiter);

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/api/commands/shipments", commandRoutes);
app.use("/api/queries", queryRoutes);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "AuditTrail Enterprise AI — Logistics Ledger",
    dbState:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// Database + Server
// --------------------------------------------------

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  let dbConnected = false;
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log("📡 Connecting to MongoDB Atlas...");
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log("✅ MongoDB Atlas connected successfully!");
      dbConnected = true;
    } catch (err) {
      if (err.message.includes("bad auth") || err.code === 8000) {
        console.warn("❌ MongoDB Atlas Authentication Failed: 'bad auth'");
        console.warn("👉 Check database username/password in `backend/.env`.");
      } else {
        console.warn("⚠️ Primary MONGODB_URI connection failed:", err.message);
      }
    }
  }

  if (!dbConnected) {
    try {
      const localUri = "mongodb://127.0.0.1:27017/audit_trail_db";
      console.log(`🔄 Fallback: Attempting connection to local MongoDB (${localUri})...`);
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
      console.log("✅ Local MongoDB connected successfully!");
      dbConnected = true;
    } catch (err) {
      console.warn("⚠️ Local MongoDB unavailable (is MongoDB running locally?)");
    }
  }

  if (dbConnected) {
    try {
      const results = await rebuildAllReadModels();
      console.log(`✅ Read models rebuilt: ${results.length} shipment(s)`);
    } catch (error) {
      console.warn("⚠️ Read-model rebuild skipped:", error.message);
    }
  } else {
    console.warn("\n-------------------------------------------------------------");
    console.warn("⚠️  DATABASE WARNING: Running in offline resilience mode.");
    console.warn("👉 Server active at http://localhost:" + PORT);
    console.warn("-------------------------------------------------------------\n");
  }

  app.listen(PORT, () => {
    console.log(`🚀 AuditTrail server running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  });
};

startServer();

module.exports = { app };