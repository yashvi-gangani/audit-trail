const {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
  getShipmentStats,
} = require("./shipmentQueries");

const getShipments = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;

    const result = await findAllShipments({
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      count: result.shipments.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: result.shipments,
    });
  } catch (error) {
    next(error);
  }
};

const getShipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shipment = await findShipmentById(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

const getShipmentHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const events = await findShipmentHistory(id);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await getShipmentStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShipments,
  getShipmentById,
  getShipmentHistory,
  getStats,
};