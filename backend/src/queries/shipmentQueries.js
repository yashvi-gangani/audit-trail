const ShipmentReadModel = require("../models/ShipmentReadModel");
const Event = require("../models/Event");
const { assessShipmentsRisk } = require("../services/shipmentRiskService");

const findAllShipments = async ({
  status,
  page = 1,
  limit = 10,
} = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);

  const skip = (currentPage - 1) * pageSize;

  const [shipments, total] = await Promise.all([
  ShipmentReadModel.find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean(),

  ShipmentReadModel.countDocuments(filter),
]);

const shipmentsWithRisk = assessShipmentsRisk(shipments);

  return {
  shipments: shipmentsWithRisk,
  total,
  page: currentPage,
  limit: pageSize,
  totalPages: Math.ceil(total / pageSize),
};
};

const findShipmentById = async (aggregateId) => {
  const shipment = await ShipmentReadModel.findOne({ aggregateId }).lean();

  if (!shipment) {
    return null;
  }

  const [shipmentWithRisk] = assessShipmentsRisk([shipment]);

  return shipmentWithRisk;
};

const findShipmentHistory = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};

const getShipmentStats = async () => {
  const shipments = await ShipmentReadModel.find().lean();

  const shipmentsWithRisk = assessShipmentsRisk(shipments);

  const total = shipmentsWithRisk.length;

  const byStatus = shipmentsWithRisk.reduce((acc, shipment) => {
    const status = shipment.status || "UNKNOWN";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const byRisk = shipmentsWithRisk.reduce((acc, shipment) => {
    const riskLevel = shipment.risk?.riskLevel || "LOW";
    acc[riskLevel] = (acc[riskLevel] || 0) + 1;
    return acc;
  }, {});

  const temperatureIssues = shipmentsWithRisk.filter(
    (shipment) =>
      typeof shipment.temperature === "number" &&
      (shipment.temperature < 2 || shipment.temperature > 8)
  ).length;

  const inTransit = shipmentsWithRisk.filter(
    (shipment) => shipment.status === "IN_TRANSIT"
  ).length;

  const completedShipments = shipmentsWithRisk.filter(
    (shipment) => shipment.createdAt && shipment.arrivedAt
  );

  const averageShipmentDuration =
    completedShipments.length > 0
      ? completedShipments.reduce((totalDuration, shipment) => {
          const duration =
            new Date(shipment.arrivedAt) - new Date(shipment.createdAt);

          return totalDuration + duration;
        }, 0) /
        completedShipments.length /
        (1000 * 60 * 60)
      : 0;

  return {
    total,
    byStatus,
    byRisk,
    temperatureIssues,
    inTransit,
    averageShipmentDurationHours: Number(
      averageShipmentDuration.toFixed(2)
    ),
  };
};

module.exports = {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
  getShipmentStats,
};