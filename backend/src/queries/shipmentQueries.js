const ShipmentReadModel = require("../models/ShipmentReadModel");
const Event = require("../models/Event");

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

  return {
    shipments,
    total,
    page: currentPage,
    limit: pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const findShipmentById = async (aggregateId) => {
  return ShipmentReadModel.findOne({ aggregateId }).lean();
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

module.exports = {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
  getShipmentStats,
};