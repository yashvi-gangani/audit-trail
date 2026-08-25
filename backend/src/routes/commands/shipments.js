const express = require("express");

const router = express.Router();

const {
  handleCreateShipment,
  handleLoadContainer,
  handleMoveContainer,
  handleTemperature,
  handleArrival,
} = require("../../commands/commandHandlers");

// Create shipment
// POST /api/commands/shipments
router.post("/", handleCreateShipment);

// Load container onto ship
// POST /api/commands/shipments/:id/load
router.post("/:id/load", handleLoadContainer);

// Move container
// POST /api/commands/shipments/:id/move
router.post("/:id/move", handleMoveContainer);

// Record temperature
// POST /api/commands/shipments/:id/temperature
router.post("/:id/temperature", handleTemperature);

// Arrive at port
// POST /api/commands/shipments/:id/arrival
router.post("/:id/arrival", handleArrival);

module.exports = router;