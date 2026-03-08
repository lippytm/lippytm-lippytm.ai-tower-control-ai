'use strict';

const logger = require('../logger');

const DEFAULT_RETRIES = parseInt(process.env.RETRY_MAX_ATTEMPTS || '3', 10);
const BASE_DELAY_MS = parseInt(process.env.RETRY_BASE_DELAY_MS || '500', 10);

/**
 * Execute an async function with exponential-backoff retries.
 * Only retries on network/server errors (5xx or no response); client errors (4xx) are not retried.
 *
 * @param {Function} fn          Async function to execute.
 * @param {object}   [opts]
 * @param {number}   [opts.retries]    Max attempts (default: env.RETRY_MAX_ATTEMPTS or 3).
 * @param {number}   [opts.baseDelay] Base delay in ms (default: env.RETRY_BASE_DELAY_MS or 500).
 * @param {string}   [opts.label]     Label used in log messages.
 * @returns {Promise<*>}
 */
async function withRetry(fn, opts = {}) {
  const maxAttempts = opts.retries !== undefined ? opts.retries : DEFAULT_RETRIES;
  const baseDelay = opts.baseDelay !== undefined ? opts.baseDelay : BASE_DELAY_MS;
  const label = opts.label || 'withRetry';

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Do not retry on HTTP 4xx client errors
      const status = err.response && err.response.status;
      if (status && status >= 400 && status < 500) {
        throw err;
      }

      if (attempt === maxAttempts) break;

      const delay = baseDelay * 2 ** (attempt - 1);
      logger.warn(`${label}: attempt ${attempt} failed, retrying in ${delay}ms`, {
        error: err.message,
      });
      await _sleep(delay);
    }
  }
  throw lastError;
}

function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { withRetry };
