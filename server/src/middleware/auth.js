const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

/**
 * Core JWT authentication middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authentication required. Please provide a Bearer token.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'audittrail_enterprise_secret_key_2024');
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token expired. Please refresh your session.', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, error: 'Invalid token.', code: 'INVALID_TOKEN' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'User not found or account deactivated.' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based access control middleware factory.
 * Accepts either a single array — requireRole(['admin', 'manager']) — or
 * multiple string arguments — requireRole('admin', 'auditor') — since both
 * styles are used across the route files. Without flattening, the
 * multi-argument form silently dropped every role after the first,
 * quietly locking auditors out of the alert-rule and log-flagging routes.
 */
const requireRole = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

/**
 * Optional auth — attaches user if token present, but doesn't block if missing
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'audittrail_enterprise_secret_key_2024');
    const user = await User.findById(decoded.userId).select('-password');
    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id.toString();
    }
  } catch (_) { /* silent */ }
  next();
};

/**
 * API-key authentication — for machine-to-machine ingestion (routes/ingest.js).
 * This was referenced by routes/ingest.js but never actually defined or
 * exported, so any request sent with an X-API-Key header instead of a
 * Bearer token crashed with "apiKeyMiddleware is not a function".
 */
const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'X-API-Key header is required.' });
    }

    const user = await User.findOne({ apiKey });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid or inactive API key.' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, requireRole, optionalAuth, apiKeyMiddleware };
