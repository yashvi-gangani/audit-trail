//install the crypto and use it
const crypto = require("crypto");

const createEventHash = ({
  aggregateId,
  eventType,
  payload,
  timestamp,
  version,
  previousHash,
}) => {
  const data = JSON.stringify({
    aggregateId,
    eventType,
    payload,
    timestamp,
    version,
    previousHash,
  });

  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
};

module.exports = {
  createEventHash,
};