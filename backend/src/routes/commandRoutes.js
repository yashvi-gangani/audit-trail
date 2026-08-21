const express = require('express');
const router = express.Router();

// POST /api/commands/shipments (Create a new shipment)
router.post('/shipments', (req, res) => {
  const { id, origin, destination, tempLimit } = req.body;
  // TODO: Validation & dispatch creation command
  res.status(201).json({
    message: "Command Accepted: CreateShipment",
    commandId: Math.random().toString(36).substring(7),
    data: { id, origin, destination }
  });
});

// POST /api/commands/shipments/:id/move (Update shipment location)
router.post('/shipments/:id/move', (req, res) => {
  const { id } = req.params;
  const { location, latitude, longitude, actor } = req.body;
  // TODO: Validation & dispatch move command
  res.status(200).json({
    message: `Command Accepted: UpdateLocation for shipment ${id}`,
    data: { location, latitude, longitude, actor }
  });
});

// POST /api/commands/shipments/:id/temperature (Record sensor temperature)
router.post('/shipments/:id/temperature', (req, res) => {
  const { id } = req.params;
  const { temperature, sensorId } = req.body;
  // TODO: Validation & dispatch record temperature command
  res.status(200).json({
    message: `Command Accepted: RecordTemperature for shipment ${id}`,
    data: { temperature, sensorId }
  });
});

module.exports = router;