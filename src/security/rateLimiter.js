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
    // Allow tests to skip rate limiting by setting DISABLE_RATE_LIMIT=true
    skip: () => process.env.DISABLE_RATE_LIMIT === 'true',
  });
}

/**
 * Sanitize user-supplied text: strip NUL bytes, dangerous control characters,
 * and trim leading/trailing whitespace.
 * Prevents certain injection vectors before forwarding to AI backends.
 * Preserves newlines (\n) and tabs (\t), which are valid inside prompts.
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') { return ''; }
  return (
    input
      // Remove NUL bytes
      .replace(/\0/g, '')
      // Remove ASCII control characters except \t (0x09) and \n (0x0a)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x01-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, '')
      .trim()
  );
}

/**
 * Validate that a route parameter (e.g. botId, replId) contains only safe
 * alphanumeric characters, hyphens, and underscores.  This prevents path
 * traversal and injection via URL parameters.
 * @param {string} param
 * @returns {boolean}
 */
function isSafeParam(param) {
  return typeof param === 'string' && /^[\w-]{1,128}$/.test(param);
}

module.exports = { createStrictLimiter, sanitizeInput, isSafeParam };

