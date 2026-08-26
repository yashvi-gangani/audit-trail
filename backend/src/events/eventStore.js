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
  /**
   * Save a new event to the Event Store log.
   * 
   * @param {Object} params
   * @param {string} params.aggregateId - Aggregate ID
   * @param {string} params.eventType - Valid event type string
   * @param {Object} params.payload - Event payload data
   * @param {number} [params.expectedVersion] - Optional expected version for concurrency checking
   * @returns {Promise<Object>} The appended event document
   */
  async saveEvent({ aggregateId, eventType, payload, expectedVersion }) {
    if (!aggregateId) {
      throw new Error('EventStore.saveEvent: aggregateId is required');
    }
    
    if (!VALID_EVENT_TYPES.includes(eventType)) {
      throw new Error(`EventStore.saveEvent: Invalid eventType '${eventType}'`);
    }

    // Determine target version
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
      // Catch MongoDB Duplicate Key Error (Code 11000) on compound index { aggregateId, version }
      if (error.code === 11000) {
        throw new ConcurrencyError(aggregateId, nextVersion);
      }
      throw error;
    }
  }

  /**
   * Retrieve the full event stream for an aggregate to replay state.
   * @param {string} aggregateId 
   * @returns {Promise<Array>}
   */
  async getStream(aggregateId) {
    return await eventRepository.getByAggregateId(aggregateId);
  }
}

module.exports = {
  eventStore: new EventStore(),
  ConcurrencyError
};