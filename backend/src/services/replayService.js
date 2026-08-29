const { getStream } = require("../events/eventStore");
const { replayEvents } = require("../aggregates/shipmentAggregate");

const reconstructShipment = async (aggregateId) => {
  if (!aggregateId) {
    throw new Error("aggregateId is required");
  }

  const events = await getStream(aggregateId);

  const state = replayEvents(events, aggregateId);

  return {
    aggregateId,
    state,
    events,
    eventCount: events.length,
  };
};

module.exports = {
  reconstructShipment,  //ok
};