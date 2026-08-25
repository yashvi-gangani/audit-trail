const mongoose = require('mongoose');
const { VALID_EVENT_TYPES } = require('../events/eventTypes');

/**
 * Event Store Mongoose Schema.
 * Represents an immutable, append-only domain event.
 */
const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: [true, 'aggregateId is required'],
      trim: true,
      index: true
    },
    eventType: {
      type: String,
      required: [true, 'eventType is required'],
      enum: {
        values: VALID_EVENT_TYPES,
        message: '{VALUE} is not a valid domain event type'
      }
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'payload is required'],
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true
    },
    version: {
      type: Number,
      required: [true, 'version is required'],
      min: [1, 'version must be at least 1']
    }
  },
  {
    timestamps: false, // We use custom immutable timestamp field
    versionKey: false  // We manage domain aggregate versioning manually
  }
);

// Compound unique index for Optimistic Concurrency Control
// Guarantees that no two events for the same aggregateId can share the same version
eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true });

// Compound index for chronological stream queries
eventSchema.index({ aggregateId: 1, timestamp: 1 });

// =========================================================================
// IMMUTABILITY MIDDLEWARE ENFORCEMENT
// Prevent any update or delete operations on historical audit events
// =========================================================================

const blockMutation = function (next) {
  const err = new Error('MUTATION BLOCKED: Historical events in the Event Store are immutable!');
  err.name = 'ImmutabilityViolationError';
  return next(err);
};

// Block update operations
eventSchema.pre('updateOne', blockMutation);
eventSchema.pre('updateMany', blockMutation);
eventSchema.pre('findOneAndUpdate', blockMutation);
eventSchema.pre('findOneAndReplace', blockMutation);

// Block delete operations
eventSchema.pre('deleteOne', blockMutation);
eventSchema.pre('deleteMany', blockMutation);
eventSchema.pre('findOneAndDelete', blockMutation);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;