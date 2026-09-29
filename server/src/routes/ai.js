const express = require('express');
const router = express.Router();
const { naturalLanguageQuery, detectAnomalies, summarizeActivity, getUserRiskScores, getAIStatus } = require('../controllers/aiController');
const { getShipmentInsights } = require('../controllers/shipmentAIController');
const { authMiddleware } = require('../middleware/auth');

router.get('/status', authMiddleware, getAIStatus);
router.post('/query', authMiddleware, naturalLanguageQuery);
router.post('/anomalies', authMiddleware, detectAnomalies);
router.post('/summarize', authMiddleware, summarizeActivity);
router.get('/risk-scores', authMiddleware, getUserRiskScores);

// Shipment-domain AI: anomaly detection + delay-risk prediction + narrative,
// combined into one call for the dashboard.
router.get('/shipments/:id/insights', authMiddleware, getShipmentInsights);

module.exports = router;
