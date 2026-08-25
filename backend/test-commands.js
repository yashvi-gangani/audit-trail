require("dotenv").config();

const mongoose = require("mongoose");

const {
  createShipment,
  loadContainer,
  moveContainer,
  recordTemperature,
  arriveAtPort,
} = require("./src/commands/shipmentCommands");

const { getStream } = require("./src/events/eventStore");

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected\n");

    const aggregateId = `TEST-${Date.now()}`;

    console.log("1. Creating shipment...");

    const created = await createShipment({
      aggregateId,
      containerNumber: "CONT-1001",
      origin: "Ahmedabad",
      destination: "Hamburg",
    });

    console.log({
      eventType: created.eventType,
      version: created.version,
    });

    console.log("\n2. Loading container...");

    const loaded = await loadContainer({
      aggregateId,
      vessel: "MV Enterprise",
    });

    console.log({
      eventType: loaded.eventType,
      version: loaded.version,
    });

    console.log("\n3. Moving container...");

    const moved = await moveContainer({
      aggregateId,
      location: "Mumbai Port",
    });

    console.log({
      eventType: moved.eventType,
      version: moved.version,
    });

    console.log("\n4. Recording temperature...");

    const temperature = await recordTemperature({
      aggregateId,
      temperature: 8.7,
      unit: "C",
    });

    console.log({
      eventType: temperature.eventType,
      version: temperature.version,
    });

    console.log("\n5. Arriving at port...");

    const arrived = await arriveAtPort({
      aggregateId,
      port: "Hamburg Port",
    });

    console.log({
      eventType: arrived.eventType,
      version: arrived.version,
    });

    console.log("\n6. Reading event stream...");

    const events = await getStream(aggregateId);

    console.table(
      events.map((event) => ({
        version: event.version,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        timestamp: event.timestamp,
      }))
    );

    console.log("\n✓ Command flow test completed successfully.");

    await mongoose.disconnect();
  } catch (error) {
    console.error("\n✗ Command flow test failed:");
    console.error(error);

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

runTest();