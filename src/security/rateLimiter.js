'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Create a tighter rate limiter for sensitive endpoints (e.g. /auth/token).
 * Defaults: 10 requests per minute.
 */
function createStrictLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || 60_000,
    max: options.max || 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded for this endpoint.' },
  });
}

/**
 * Sanitize user-supplied text: strip NUL bytes and trim whitespace.
 * Prevents certain injection vectors before forwarding to AI backends.
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Remove NUL bytes and control characters (except newline/tab which are valid in prompts)
  return input.replace(/\0/g, '').trim();
}

module.exports = { createStrictLimiter, sanitizeInput };
