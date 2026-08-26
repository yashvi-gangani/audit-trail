const eventRepository = require('./eventRepository');
const { VALID_EVENT_TYPES } = require('./eventTypes');

class ConcurrencyError extends Error {
  constructor(aggregateId, expectedVersion) {
    super(`CONCURRENCY CONFLICT: Aggregate '${aggregateId}' already has event version ${expectedVersion}.`);
    this.name = 'ConcurrencyError';
    this.aggregateId = aggregateId;
    this.expectedVersion = expectedVersion;
  }
}

class EventStore {
  async saveEvent({ aggregateId, eventType, payload, expectedVersion }) {
    if (!aggregateId) {
      throw new Error('EventStore.saveEvent: aggregateId is required');
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      throw new Error(`EventStore.saveEvent: Invalid eventType '${eventType}'`);
    }

    let nextVersion;
    if (expectedVersion !== undefined && expectedVersion !== null) {
      nextVersion = expectedVersion;
    } else {
      const currentVersion = await eventRepository.getLatestVersion(aggregateId);
      nextVersion = currentVersion + 1;
    }

    try {
      const savedEvent = await eventRepository.append({
        aggregateId,
        eventType,
        payload: payload || {},
        version: nextVersion,
        timestamp: new Date()
      });

      console.log(`✅ [EventStore] Appended event '${eventType}' v${nextVersion} for aggregate '${aggregateId}'`);
      return savedEvent;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConcurrencyError(aggregateId, nextVersion);
      }
      throw error;
    }
  }

  async getStream(aggregateId) {
    return await eventRepository.getByAggregateId(aggregateId);
  }
}

module.exports = {
  eventStore: new EventStore(),
  ConcurrencyError
};