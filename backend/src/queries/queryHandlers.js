const {
  findAllShipments,
  findShipmentById,
  findShipmentHistory,
} = require("./shipmentQueries");

const getShipments = async (req, res, next) => {
  try {
    const shipments = await findAllShipments();

    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments,
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

module.exports = {
  getShipments,
  getShipmentById,
  getShipmentHistory,
};