const Shipment = require('../models/Shipment');
const { getEventsForAggregate } = require('../engine/eventReplay');
const { asyncHandler, createError } = require('../middleware/errorHandler');

/**
 * Shipment-domain AI features.
 *
 * The existing controllers/aiController.js is Gemini-powered, but every
 * feature in it (natural-language query, anomaly detection, executive
 * summary, risk scores) operates on the AuditLog collection — i.e. "who
 * did what in the system". None of it looks at the actual event-sourced
 * shipment ledger this product is named after.
 *
 * This file adds three AI features that analyze the Shipment/EventStore
 * domain instead:
 *   1. Anomaly Detection  — cold-chain excursions, rapid temperature
 *      swings, stalled shipments, hazmat-specific risk combinations.
 *   2. Delay-Risk Scoring — a predictive score for "how likely is this
 *      shipment to miss its ETA", from event-derived signals.
 *   3. AI Narrative       — a natural-language summary of the shipment's
 *      event history, Gemini-enhanced when GEMINI_API_KEY is set and
 *      falling back to a deterministic local template otherwise (so the
 *      feature never breaks for someone without a key).
 *
 * All three are combined behind one endpoint for the dashboard to call:
 *   GET /api/ai/shipments/:id/insights
 */

const SAFE_TEMP_MIN = 2;
const SAFE_TEMP_MAX = 8;
const RAPID_SWING_DELTA_C = 5;
const RAPID_SWING_WINDOW_MS = 2 * 60 * 60 * 1000;
const STALLED_GAP_MS = 48 * 60 * 60 * 1000;

// ─── Gemini setup (mirrors controllers/aiController.js, kept local so this
//     file has no dependency on that module's private state) ──────────────
let genAI = null;
let model = null;

const initAI = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return false;
  }
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return true;
  } catch (e) {
    return false;
  }
};

const isAIAvailable = () => (model ? true : initAI());

// ─── 1. Anomaly Detection ──────────────────────────────────────────────────

const detectShipmentAnomalies = (shipment, events) => {
  const anomalies = [];
  const isHazmat = shipment.items?.some((i) => i.hazmat);

  // Temperature excursions + rapid swings
  const tempEvents = events
    .filter((e) => e.eventType === 'TEMPERATURE_RECORDED')
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let previous = null;
  for (const event of tempEvents) {
    const { value } = event.payload || {};
    if (typeof value !== 'number') continue;

    if (value < SAFE_TEMP_MIN || value > SAFE_TEMP_MAX) {
      anomalies.push({
        type: 'TEMPERATURE_EXCURSION',
        severity: isHazmat ? 'CRITICAL' : 'HIGH',
        eventVersion: event.version,
        message: `Reading of ${value}°C at v${event.version} is outside the safe range (${SAFE_TEMP_MIN}°C–${SAFE_TEMP_MAX}°C).${isHazmat ? ' Cargo includes hazmat items — treat as high priority.' : ''}`,
      });
    }

    if (previous) {
      const delta = Math.abs(value - previous.value);
      const gapMs = new Date(event.timestamp) - new Date(previous.timestamp);
      if (delta >= RAPID_SWING_DELTA_C && gapMs <= RAPID_SWING_WINDOW_MS && gapMs >= 0) {
        anomalies.push({
          type: 'RAPID_TEMPERATURE_SWING',
          severity: 'MEDIUM',
          eventVersion: event.version,
          message: `Temperature swung ${delta.toFixed(1)}°C between v${previous.version} and v${event.version} in under 2h — possible sensor fault or door left open.`,
        });
      }
    }
    previous = { value, timestamp: event.timestamp, version: event.version };
  }

  // Stalled shipment: long gap since the last event while still in flight
  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastEvent = sortedEvents[sortedEvents.length - 1];
  if (lastEvent && !['DELIVERED', 'CANCELLED'].includes(shipment.status)) {
    const sinceLastEventMs = Date.now() - new Date(lastEvent.timestamp).getTime();
    if (sinceLastEventMs >= STALLED_GAP_MS) {
      anomalies.push({
        type: 'STALLED_SHIPMENT',
        severity: 'MEDIUM',
        eventVersion: lastEvent.version,
        message: `No new events in ${Math.round(sinceLastEventMs / (60 * 60 * 1000))}h while status is still "${shipment.status}".`,
      });
    }
  }

  // Overdue vs. estimated delivery
  if (
    shipment.estimatedDelivery &&
    !['DELIVERED', 'CANCELLED'].includes(shipment.status) &&
    new Date(shipment.estimatedDelivery) < new Date()
  ) {
    anomalies.push({
      type: 'PAST_ESTIMATED_DELIVERY',
      severity: 'HIGH',
      eventVersion: lastEvent?.version,
      message: `Estimated delivery (${new Date(shipment.estimatedDelivery).toDateString()}) has passed and the shipment has not been marked delivered.`,
    });
  }

  const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const anomalyScore = anomalies.reduce((sum, a) => sum + (severityWeight[a.severity] || 1), 0);

  return { anomalies, anomalyScore };
};

// ─── 2. Delay-Risk Prediction ──────────────────────────────────────────────

const predictDelayRisk = (shipment) => {
  let score = 0;
  const reasons = [];

  if (shipment.status === 'DELAYED') {
    score += 35;
    reasons.push('Shipment is already flagged as DELAYED.');
  }

  if (shipment.temperatureAlertCount > 0) {
    const bump = Math.min(25, shipment.temperatureAlertCount * 8);
    score += bump;
    reasons.push(`${shipment.temperatureAlertCount} temperature alert(s) recorded, which often precede inspection holds.`);
  }

  if (
    shipment.estimatedDelivery &&
    !['DELIVERED', 'CANCELLED'].includes(shipment.status) &&
    new Date(shipment.estimatedDelivery) < new Date()
  ) {
    score += 30;
    reasons.push('Estimated delivery date has already passed.');
  }

  if (shipment.items?.some((i) => i.hazmat)) {
    score += 10;
    reasons.push('Hazmat cargo is more likely to face customs holds.');
  }

  const ageHours = shipment.createdAt
    ? (Date.now() - new Date(shipment.createdAt).getTime()) / (60 * 60 * 1000)
    : 0;
  if (ageHours > 0 && shipment.eventCount <= 2 && !['DELIVERED', 'CANCELLED'].includes(shipment.status)) {
    score += 15;
    reasons.push('Very few events recorded relative to how long the shipment has been open — activity looks stalled.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

  if (reasons.length === 0) {
    reasons.push('No risk signals detected — shipment is tracking normally.');
  }

  return { score, level, reasons };
};

// ─── 3. AI Narrative ────────────────────────────────────────────────────────

const eventToSentence = (event) => {
  const p = event.payload || {};
  switch (event.eventType) {
    case 'SHIPMENT_CREATED':
      return `The shipment was created for a route from ${p.origin?.city || 'an unspecified origin'} to ${p.destination?.city || 'an unspecified destination'} via ${p.carrier || 'an unspecified carrier'}.`;
    case 'ITEM_ADDED':
      return `${p.quantity ?? '?'} ${p.unit || 'units'} of "${p.name || p.sku}" were added to the manifest.`;
    case 'CONTAINER_LOADED':
      return `Container ${p.containerId || ''} was loaded.`;
    case 'LOCATION_UPDATED':
      return `It was tracked at ${p.name || p.city || 'a waypoint'}.`;
    case 'TEMPERATURE_RECORDED':
      return `A temperature reading of ${p.value}°${p.unit || 'C'} was logged${p.alert ? ' (flagged as an alert)' : ''}.`;
    case 'IN_TRANSIT':
      return `The shipment entered transit${p.carrier ? ` with ${p.carrier}` : ''}.`;
    case 'DELAYED':
      return `It was marked delayed: ${p.reason || 'no reason given'}.`;
    case 'DELIVERED':
      return `It was marked delivered.`;
    case 'SHIPMENT_CANCELLED':
      return `The shipment was cancelled: ${p.reason || 'no reason given'}.`;
    case 'TRANSFER_INITIATED':
      return `A carrier transfer to ${p.newCarrier || 'a new carrier'} was initiated.`;
    default:
      return null;
  }
};

const buildLocalNarrative = (shipment, events, anomalyResult, delayRisk) => {
  const sentences = [...events]
    .sort((a, b) => a.version - b.version)
    .map(eventToSentence)
    .filter(Boolean);

  let narrative = sentences.join(' ') || 'No events have been recorded for this shipment yet.';

  narrative += ` Current status: ${shipment.status}. Delay risk is assessed as ${delayRisk.level} (${delayRisk.score}/100).`;

  if (anomalyResult.anomalies.length > 0) {
    narrative += ` ${anomalyResult.anomalies.length} anomal${anomalyResult.anomalies.length === 1 ? 'y was' : 'ies were'} flagged, most notably: ${anomalyResult.anomalies[0].message}`;
  } else {
    narrative += ' No anomalies were detected in the event history.';
  }

  return narrative;
};

const buildNarrative = async (shipment, events, anomalyResult, delayRisk) => {
  const localNarrative = buildLocalNarrative(shipment, events, anomalyResult, delayRisk);

  if (!isAIAvailable()) {
    return { narrative: localNarrative, source: 'local-template' };
  }

  try {
    const prompt = `You are a logistics operations analyst. Rewrite the following factual shipment summary as a sharper, 2-3 sentence executive narrative for a dashboard. Do not invent facts not present in the input, and do not use markdown.\n\n${localNarrative}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    if (!text) throw new Error('Empty Gemini response');
    return { narrative: text, source: 'gemini-1.5-flash' };
  } catch (e) {
    return { narrative: localNarrative, source: 'local-template' };
  }
};

// ─── Combined endpoint ──────────────────────────────────────────────────────

// GET /api/ai/shipments/:id/insights
const getShipmentInsights = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [shipment, events] = await Promise.all([
    Shipment.findOne({ shipmentId: id }).lean(),
    getEventsForAggregate(id),
  ]);

  if (!shipment) throw createError('Shipment not found', 404);
  if (events.length === 0) throw createError('No events found for this shipment', 404);

  const anomalyResult = detectShipmentAnomalies(shipment, events);
  const delayRisk = predictDelayRisk(shipment);
  const { narrative, source } = await buildNarrative(shipment, events, anomalyResult, delayRisk);

  res.json({
    shipmentId: id,
    anomalies: anomalyResult.anomalies,
    anomalyScore: anomalyResult.anomalyScore,
    delayRisk,
    narrative,
    narrativeSource: source,
    generatedAt: new Date().toISOString(),
  });
});

module.exports = {
  getShipmentInsights,
  // exported for unit testing / reuse
  detectShipmentAnomalies,
  predictDelayRisk,
};
