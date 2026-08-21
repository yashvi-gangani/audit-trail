const EVENT_TYPES = require("../events/eventTypes");

const createInitialState = (aggregateId) => ({
  aggregateId,
  status: "UNKNOWN",
  containerNumber: null,
  origin: null,
  destination: null,
  vessel: null,
  currentLocation: null,
  temperature: null,
  temperatureUnit: null,
  createdAt: null,
  loadedAt: null,
  arrivedAt: null,
  lastEventVersion: 0,
  lastEventType: null,
});

const applyEvent = (state, event) => {
  const nextState = { ...state };

  switch (event.eventType) {
    case EVENT_TYPES.CONTAINER_CREATED:
      nextState.status = "CREATED";
      nextState.containerNumber =
        event.payload?.containerNumber || null;
      nextState.origin = event.payload?.origin || null;
      nextState.destination =
        event.payload?.destination || null;
      nextState.createdAt = event.timestamp;
      break;

    case EVENT_TYPES.LOADED_ON_SHIP:
      nextState.status = "IN_TRANSIT";
      nextState.vessel = event.payload?.vessel || null;
      nextState.loadedAt = event.timestamp;
      break;

    case EVENT_TYPES.CONTAINER_MOVED:
      nextState.currentLocation =
        event.payload?.location || null;
      break;

    case EVENT_TYPES.TEMPERATURE_SPIKE:
      nextState.temperature =
        event.payload?.temperature ?? null;
      nextState.temperatureUnit =
        event.payload?.unit || null;
      break;

    case EVENT_TYPES.ARRIVED_AT_PORT:
      nextState.status = "ARRIVED";
      nextState.currentLocation =
        event.payload?.port ||
        event.payload?.location ||
        null;
      nextState.arrivedAt = event.timestamp;
      break;

    default:
      console.warn(
        `Unknown event type: ${event.eventType}`
      );
      return nextState;
  }

  nextState.lastEventVersion = event.version;
  nextState.lastEventType = event.eventType;

  return nextState;
};

const replayEvents = (events, aggregateId) => {
  let state = createInitialState(aggregateId);

  for (const event of events) {
    state = applyEvent(state, event);
  }

  return state;
};

module.exports = {
  createInitialState,
  applyEvent,
  replayEvents,
};