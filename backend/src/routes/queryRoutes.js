const express = require("express");

const {
  getShipments,
  getShipmentById,
  getShipmentHistory,
  getShipmentReplay,
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

router.get(
  "/shipments/:id/replay",
  getShipmentReplay
);

module.exports = router;