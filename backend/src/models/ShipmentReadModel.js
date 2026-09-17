const mongoose = require("mongoose");

const shipmentReadModelSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    containerNumber: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "UNKNOWN",
      index: true,
    },

    origin: {
      type: String,
      default: null,
    },

    destination: {
      type: String,
      default: null,
    },

    vessel: {
      type: String,
      default: null,
    },

    currentLocation: {
      type: String,
      default: null,
    },

    temperature: {
      type: Number,
      default: null,
    },

    temperatureUnit: {
      type: String,
      default: null,
    },

    createdAt: {
      type: Date,
      default: null,
    },

    loadedAt: {
      type: Date,
      default: null,
    },

    arrivedAt: {
      type: Date,
      default: null,
    },

    lastEventVersion: {
      type: Number,
      default: 0,
    },

    lastEventType: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.ShipmentReadModel ||
  mongoose.model("ShipmentReadModel", shipmentReadModelSchema);