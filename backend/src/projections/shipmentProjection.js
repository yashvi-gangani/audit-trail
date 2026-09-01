const ShipmentReadModel = require("../models/ShipmentReadModel");
const { getStream } = require("../events/eventStore");
const {
  createInitialState,
  applyEvent,
} = require("../aggregates/shipmentAggregate");

const projectEvent = async (event) => {
  if (!event || !event.aggregateId) {
    throw new Error("Valid event with aggregateId is required");
  }

  const existing = await ShipmentReadModel.findOne({
    aggregateId: event.aggregateId,
  }).lean();

  let state = existing || createInitialState(event.aggregateId);

  state = applyEvent(state, event);

  await ShipmentReadModel.findOneAndUpdate(
    { aggregateId: event.aggregateId },
    {
      $set: {
        ...state,
        lastEventVersion: event.version,
        lastEventType: event.eventType,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return state;
};

const rebuildReadModel = async (aggregateId) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  const events = await getStream(aggregateId);//events

  let state = createInitialState(aggregateId);

  for (const event of events) {
    state = applyEvent(state, event);
  }

  await ShipmentReadModel.findOneAndUpdate(
    { aggregateId },
    {
      $set: state,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return state;
};

const rebuildAllReadModels = async () => {
  const Event = require("../models/Event");

  const aggregateIds = await Event.distinct("aggregateId");

  const results = [];

  for (const aggregateId of aggregateIds) {
    const state = await rebuildReadModel(aggregateId);
    results.push(state);
  }

  return results;
};

module.exports = {
  projectEvent,
  rebuildReadModel,
  rebuildAllReadModels,
};