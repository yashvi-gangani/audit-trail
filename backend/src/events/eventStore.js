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

  return appendEvent({
    aggregateId,
    eventType,
    payload,
    timestamp,
    version,
    previousHash,
    hash,
  });
};

const getStream = async (aggregateId) => {
  return getEventsByAggregateId(aggregateId);
};

module.exports = {
  append,
  getStream,
};