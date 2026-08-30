const express = require("express");
//this is query routes
const {
  getShipments,
  getShipmentById,
  getShipmentHistory,
  getStats,
} = require("../queries/queryHandlers");

const router = express.Router();

router.get("/shipments", getShipments);

router.get("/shipments/stats", getStats);

router.get("/shipments/:id", getShipmentById);

router.get(
  "/shipments/:id/history",
  getShipmentHistory
);

module.exports = router;