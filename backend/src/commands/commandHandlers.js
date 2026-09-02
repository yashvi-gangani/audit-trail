const shipmentCommands = require("./shipmentCommands");

const handleCreateShipment = async (req, res, next) => {
  try {
    const event = await shipmentCommands.createShipment({
      aggregateId: req.body.aggregateId,
      containerNumber: req.body.containerNumber,
      origin: req.body.origin,
      destination: req.body.destination,
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

const handleLoadContainer = async (req, res, next) => {
  try {
    const event = await shipmentCommands.loadContainer({
      aggregateId: req.params.id,
      vessel: req.body.vessel,
    });

    res.status(201).json({
      success: true,
      message: "Container loaded on ship", //events
      event,
    });
  } catch (error) {
    next(error);
  }
};

const handleMoveContainer = async (req, res, next) => {
  try {
    const event = await shipmentCommands.moveContainer({
      aggregateId: req.params.id,
      location: req.body.location,
    });

    res.status(201).json({
      success: true,
      message: "Container location updated",
      event,
    });
  } catch (error) {
    next(error);
  }
};

const handleTemperature = async (req, res, next) => {
  try {
    const event = await shipmentCommands.recordTemperature({
      aggregateId: req.params.id,
      temperature: req.body.temperature,
      unit: req.body.unit,
    });

    res.status(201).json({
      success: true,
      message: "Temperature event recorded",
      event,
    });
  } catch (error) {
    next(error);
  }
};

const handleArrival = async (req, res, next) => {
  try {
    const event = await shipmentCommands.arriveAtPort({
      aggregateId: req.params.id,
      port: req.body.port,
    });

    res.status(201).json({
      success: true,
      message: "Container arrival recorded",
      event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateShipment,
  handleLoadContainer,
  handleMoveContainer,
  handleTemperature,
  handleArrival,
};