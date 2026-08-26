const {
  appendEvent,
  getEventsByAggregateId,
  getLatestEvent,
} = require("./eventRepository");

const { createEventHash } = require("../utils/hash");

const append = async ({
  aggregateId,
  eventType,
  payload,
}) => {
  const latestEvent = await getLatestEvent(aggregateId);

  const version = latestEvent
    ? latestEvent.version + 1
    : 1;

  const previousHash = latestEvent
    ? latestEvent.hash
    : null;

  const timestamp = new Date();

  const hash = createEventHash({
    aggregateId,
    eventType,
    payload,
    timestamp,
    version,
    previousHash,
  });

  const event = await appendEvent({
    aggregateId,
    eventType,
    payload,
    timestamp,
    version,
    previousHash,
    hash,
  });

  // Update the read model after the event is successfully stored.
  const { projectEvent } = require("../projections/shipmentProjection");

  await projectEvent(event);

  return event;
};

const getStream = async (aggregateId) => {
  return getEventsByAggregateId(aggregateId);
};

module.exports = {
  append,
  getStream,
};