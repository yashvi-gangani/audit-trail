const EVENT_TYPES = require("../events/eventTypes");
const { append } = require("../events/eventStore");

const createShipment = async ({
  aggregateId,
  containerNumber,
  origin,
  destination,
}) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  if (!containerNumber) {
    throw new Error("containerNumber is required");
  }

  if (!origin || !destination) {
    throw new Error("origin and destination are required");
  }

  return append({
    aggregateId,
    eventType: EVENT_TYPES.CONTAINER_CREATED,
    payload: {
      containerNumber,
      origin,
      destination,
    },
  });
};

const loadContainer = async ({
  aggregateId,
  vessel,
}) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  if (!vessel) {
    throw new Error("vessel is required");
  }

  return append({
    aggregateId,
    eventType: EVENT_TYPES.LOADED_ON_SHIP,
    payload: {
      vessel,
    },
  });
};

const moveContainer = async ({
  aggregateId,
  location,
}) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  if (!location) {
    throw new Error("location is required");
  }

  return append({
    aggregateId,
    eventType: EVENT_TYPES.CONTAINER_MOVED,
    payload: {
      location,
    },
  });
};

const recordTemperature = async ({
  aggregateId,
  temperature,
  unit = "C",
}) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  if (temperature === undefined || temperature === null) {
    throw new Error("temperature is required");
  }

  return append({
    aggregateId,
    eventType: EVENT_TYPES.TEMPERATURE_SPIKE,
    payload: {
      temperature,
      unit,
    },
  });
};

const arriveAtPort = async ({
  aggregateId,
  port,
}) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  if (!port) {
    throw new Error("port is required");
  }

  return append({
    aggregateId,
    eventType: EVENT_TYPES.ARRIVED_AT_PORT,
    payload: {
      port,
    },
  });
};

module.exports = {
  createShipment,
  loadContainer,
  moveContainer,
  recordTemperature,
  arriveAtPort,
};