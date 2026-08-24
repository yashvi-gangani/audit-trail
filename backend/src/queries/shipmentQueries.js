const ShipmentReadModel = require("../models/ShipmentReadModel");
const Event = require("../models/Event");

const findAllShipments = async () => {
  return ShipmentReadModel.find()
    .sort({ updatedAt: -1 })
    .lean();
};

const findShipmentById = async (aggregateId) => {
  return ShipmentReadModel.findOne({ aggregateId })
    .lean();
};

const findShipmentHistory = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};

module.exports = {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
};