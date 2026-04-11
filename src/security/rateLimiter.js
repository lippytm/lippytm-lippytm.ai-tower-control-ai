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
 * Sanitize user-supplied text: strip NUL bytes and non-printable control
 * characters (except newline \n, carriage return \r, and tab \t which are
 * valid in prompts), then trim surrounding whitespace.
 * Prevents certain injection vectors before forwarding to AI backends.
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Strip NUL bytes and C0/C1 control characters except \t (0x09), \n (0x0A), \r (0x0D)
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '').trim();
}

module.exports = { createStrictLimiter, sanitizeInput };
