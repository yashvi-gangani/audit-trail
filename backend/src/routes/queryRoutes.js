const express = require("express");

const {
  getShipments,
  getShipmentById,
  getShipmentHistory,
} = require("../queries/queryHandlers");

const router = express.Router();

router.get("/shipments", getShipments);

router.get("/shipments/:id", getShipmentById);

router.get(
  "/shipments/:id/history",
  getShipmentHistory
);

module.exports = router;