const Event = require('../models/Event');

class EventRepository {
  /**
   * Append a new event document to the MongoDB Event Store.
   * @param {Object} eventData - { aggregateId, eventType, payload, version, timestamp }
   * @returns {Promise<Object>} Created event document
   */
  async append(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  /**
   * Fetch all events for a given aggregate in chronological version order.
   * @param {string} aggregateId - Aggregate unique identifier
   * @returns {Promise<Array>} Chronological list of events
   */
  async getByAggregateId(aggregateId) {
    return await Event.find({ aggregateId })
      .sort({ version: 1 })
      .lean();
  }

  /**
   * Find the highest version number recorded for an aggregate.
   * @param {string} aggregateId - Aggregate unique identifier
   * @returns {Promise<number>} Current highest version (0 if aggregate has no events)
   */
  async getLatestVersion(aggregateId) {
    const latestEvent = await Event.findOne({ aggregateId })
      .sort({ version: -1 })
      .select('version')
      .lean();
    
    return latestEvent ? latestEvent.version : 0;
  }

  /**
   * Fetch events starting from a specific version.
   * @param {string} aggregateId 
   * @param {number} fromVersion 
   * @returns {Promise<Array>}
   */
  async getEventsFromVersion(aggregateId, fromVersion) {
    return await Event.find({
      aggregateId,
      version: { $gte: fromVersion }
    })
      .sort({ version: 1 })
      .lean();
  }
}

module.exports = new EventRepository();