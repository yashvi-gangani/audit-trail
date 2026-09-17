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
  const stats = await ShipmentReadModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const total = await ShipmentReadModel.countDocuments();

  return {
    total,
    byStatus: stats.map((item) => ({
      status: item._id || "UNKNOWN",
      count: item.count,
    })),
  };
};

const { replayEvents } = require("../aggregates/shipmentAggregate");

const findShipmentAtTime = async (aggregateId, { cutoffTime, targetVersion, daysAgo } = {}) => {
  const query = { aggregateId };

  let timeLimit = null;
  if (daysAgo !== undefined && daysAgo !== null && daysAgo !== "") {
    const days = Number(daysAgo);
    timeLimit = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  } else if (cutoffTime) {
    timeLimit = new Date(cutoffTime);
  }

  if (timeLimit && !isNaN(timeLimit.getTime())) {
    query.timestamp = { $lte: timeLimit };
  } else if (targetVersion !== undefined && targetVersion !== null && targetVersion !== "") {
    query.version = { $lte: Number(targetVersion) };
  }

  const events = await Event.find(query).sort({ version: 1 }).lean();
  const reconstructedState = replayEvents(events, aggregateId);
  const [stateWithRisk] = assessShipmentsRisk([reconstructedState]);

  // Also fetch total events for total version count
  const totalEventsCount = await Event.countDocuments({ aggregateId });

  return {
    reconstructedState: stateWithRisk,
    appliedEventCount: events.length,
    totalEventsCount,
    cutoffTimestamp: timeLimit ? timeLimit.toISOString() : (events[events.length - 1]?.timestamp || null),
    targetVersion: events.length > 0 ? events[events.length - 1].version : 0,
    events,
  };
};

module.exports = {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
  findShipmentAtTime,
  getShipmentStats,
};