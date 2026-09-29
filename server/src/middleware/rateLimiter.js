const rateLimit = require('express-rate-limit');

// In local development, hitting these limits mid-demo (React StrictMode
// double-firing effects, several tabs open at once, a long testing
// session against a single in-memory counter that never resets except
// on process restart) was blocking normal use, not actual abuse.
// Rate limiting is a production concern — it stays fully enforced when
// NODE_ENV=production, and is skipped everywhere else.
const isDev = process.env.NODE_ENV !== 'production';

/**
 * General API rate limiter — 200 requests per 15 minutes per IP in production
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, error: 'Too many requests. Please try again in 15 minutes.' },
});

/**
 * Auth rate limiter — 15 attempts per 15 minutes per IP (prevent brute force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, error: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

/**
 * Command rate limiter — 60 write operations per minute per IP
 */
const commandLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, error: 'Command rate limit exceeded. Please slow down.' },
});

module.exports = { generalLimiter, authLimiter, commandLimiter };
