const HIGH_RISK_TEMPERATURE_MIN = 2;
const HIGH_RISK_TEMPERATURE_MAX = 8;

const STALE_EVENT_HOURS = 24;
const LONG_TRANSIT_HOURS = 72;

const calculateHoursSince = (date) => {
  if (!date) {
    return null;
  }

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return (Date.now() - timestamp) / (1000 * 60 * 60);
};

const assessShipmentRisk = (shipment) => {
  const reasons = [];
  let riskLevel = "LOW";

  const temperature = shipment.temperature;

  // Rule 1: Temperature outside the expected range
  if (
    typeof temperature === "number" &&
    (temperature < HIGH_RISK_TEMPERATURE_MIN ||
      temperature > HIGH_RISK_TEMPERATURE_MAX)
  ) {
    riskLevel = "HIGH";

    reasons.push(
      `Temperature is outside the safe range of ${HIGH_RISK_TEMPERATURE_MIN}°C to ${HIGH_RISK_TEMPERATURE_MAX}°C`
    );
  }

  // Rule 2: Shipment has been in transit for too long
  if (shipment.status === "IN_TRANSIT") {
    const transitStart = shipment.loadedAt || shipment.createdAt;
    const transitHours = calculateHoursSince(transitStart);

    if (transitHours !== null && transitHours > LONG_TRANSIT_HOURS) {
      if (riskLevel !== "HIGH") {
        riskLevel = "MEDIUM";
      }

      reasons.push(
        `Shipment has been in transit for more than ${LONG_TRANSIT_HOURS} hours`
      );
    }
  }

  // Rule 3: No recent shipment event
  const eventHours = calculateHoursSince(shipment.updatedAt);

  if (eventHours !== null && eventHours > STALE_EVENT_HOURS) {
    if (riskLevel === "LOW") {
      riskLevel = "MEDIUM";
    }

    reasons.push(
      `No shipment update has been recorded for more than ${STALE_EVENT_HOURS} hours`
    );
  }

  // Rule 4: Missing current location
  if (
    shipment.status === "IN_TRANSIT" &&
    (!shipment.currentLocation ||
      shipment.currentLocation.trim() === "")
  ) {
    if (riskLevel === "LOW") {
      riskLevel = "LOW";
    }

    reasons.push("Current location is missing while shipment is in transit");
  }

  if (reasons.length === 0) {
    reasons.push("No known shipment anomalies detected");
  }

  return {
    riskLevel,
    reasons,
  };
};

const assessShipmentsRisk = (shipments) => {
  return shipments.map((shipment) => ({
    ...shipment,
    risk: assessShipmentRisk(shipment),
  }));
};

module.exports = {
  assessShipmentRisk,
  assessShipmentsRisk,
};