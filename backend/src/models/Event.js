const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true,
      immutable: true,
    },

    eventType: {
      type: String,
      required: true,
      immutable: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      immutable: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    version: {
      type: Number,
      required: true,
      immutable: true,
    },

    previousHash: {
      type: String,
      default: null,
      immutable: true,
    },

    hash: {
      type: String,
      required: true,
      immutable: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

// An aggregate cannot have two events with the same version.
eventSchema.index(
  { aggregateId: 1, version: 1 },
  { unique: true }
);

// Prevent accidental updates/deletes through the model.
eventSchema.pre(
  ["updateOne", "updateMany", "findOneAndUpdate", "replaceOne"],
  function () {
    throw new Error("Event Store is append-only. Events cannot be updated.");
  }
);

eventSchema.pre(
  ["deleteOne", "deleteMany", "findOneAndDelete", "findByIdAndDelete"],
  function () {
    throw new Error("Event Store is append-only. Events cannot be deleted.");
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;