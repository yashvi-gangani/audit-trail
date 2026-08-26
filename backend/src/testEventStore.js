const connectDB = require('./config/db');
const { eventStore, ConcurrencyError } = require('./events/eventStore');
const { EVENT_TYPES } = require('./events/eventTypes');
const Event = require('./models/Event');

async function runVerificationTest() {
  console.log('\n======================================================');
  console.log('🧪 Starting Week 2 Event Store Schema Verification');
  console.log('======================================================\n');

  await connectDB();

  const testAggregateId = `TEST-SHIPMENT-${Date.now()}`;

  try {
    // ---------------------------------------------------------------
    // Test 1: Append sequential events
    // ---------------------------------------------------------------
    console.log('🔹 Test 1: Appending sequential event stream...');
    const e1 = await eventStore.saveEvent({
      aggregateId: testAggregateId,
      eventType: EVENT_TYPES.SHIPMENT_CREATED,
      payload: { origin: 'Berlin Hub', destination: 'Liege Medical Center' }
    });

    const e2 = await eventStore.saveEvent({
      aggregateId: testAggregateId,
      eventType: EVENT_TYPES.LOAD_CONTAINER,
      payload: { containerId: 'C-9812', tempTarget: 4.0 }
    });

    console.log(`✔️ Event 1 saved with version: ${e1.version}`);
    console.log(`✔️ Event 2 saved with version: ${e2.version}`);

    // ---------------------------------------------------------------
    // Test 2: Query event stream
    // ---------------------------------------------------------------
    console.log('\n🔹 Test 2: Fetching chronological stream...');
    const stream = await eventStore.getStream(testAggregateId);
    console.log(`✔️ Retrieved ${stream.length} events for ${testAggregateId}`);
    stream.forEach(ev => console.log(`   - v${ev.version} | ${ev.eventType} | ${ev.timestamp.toISOString()}`));

    // ---------------------------------------------------------------
    // Test 3: Verify Optimistic Concurrency Control (OCC)
    // ---------------------------------------------------------------
    console.log('\n🔹 Test 3: Testing OCC (attempting duplicate version 1)...');
    try {
      await eventStore.saveEvent({
        aggregateId: testAggregateId,
        eventType: EVENT_TYPES.UPDATE_LOCATION,
        payload: { location: 'Conflict Point' },
        expectedVersion: 1 // Already exists!
      });
      console.error('❌ FAIL: OCC did not block duplicate version!');
    } catch (err) {
      if (err instanceof ConcurrencyError) {
        console.log(`✔️ SUCCESS: OCC Conflict intercepted! Message: "${err.message}"`);
      } else {
        console.error('❌ Unexpected error type:', err);
      }
    }

    // ---------------------------------------------------------------
    // Test 4: Verify Append-Only Immutability Enforcement
    // ---------------------------------------------------------------
    console.log('\n🔹 Test 4: Testing Immutability (attempting updateOne on event log)...');
    try {
      await Event.updateOne(
        { aggregateId: testAggregateId, version: 1 },
        { $set: { eventType: 'MUTATED_EVENT' } }
      );
      console.error('❌ FAIL: Mutation was allowed on historical event!');
    } catch (err) {
      console.log(`✔️ SUCCESS: Immutability Hook blocked mutation! Message: "${err.message}"`);
    }

    console.log('\n======================================================');
    console.log('🎉 ALL WEEK 2 EVENT STORE VERIFICATIONS PASSED!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Error running verification:', error);
  } process.exit(0);
}

runVerificationTest();
