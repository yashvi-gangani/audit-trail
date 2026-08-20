const Event = require("../models/Event");

const appendEvent = async (eventData) => {
  return Event.create(eventData);
};

const getEventsByAggregateId = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};

const getLatestEvent = async (aggregateId) => {
  return Event.findOne({ aggregateId })
    .sort({ version: -1 })
    .lean();
};

const getEventCount = async (aggregateId) => {
  return Event.countDocuments({ aggregateId });
};

module.exports = {
  appendEvent,
  getEventsByAggregateId,
  getLatestEvent,
  getEventCount,
};