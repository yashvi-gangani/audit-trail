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
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected");

    // Rebuild shipment read models from the event store
    try {
      const results = await rebuildAllReadModels();

      console.log(
        `✅ Read models rebuilt: ${results.length} shipment(s)`
      );
    } catch (error) {
      console.warn(
        "⚠️ Read-model rebuild skipped:",
        error.message
      );
    }

    app.listen(PORT, () => {
      console.log(
        `🚀 AuditTrail server running on port ${PORT}`
      );
      console.log(
        `   Health: http://localhost:${PORT}/api/health`
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app };