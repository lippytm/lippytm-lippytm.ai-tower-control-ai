'use strict';

const axios = require('axios');
const logger = require('../logger');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

/** Maximum number of retry attempts for transient errors (429, 5xx). */
const MAX_RETRIES = 3;
/** Base delay in ms for exponential back-off. */
const RETRY_BASE_DELAY_MS = 1_000;

/**
 * Determine whether an axios error is retryable (rate-limit or server error).
 * @param {Error} err
 * @returns {boolean}
 */
function isRetryable(err) {
  if (!err.response) return true; // network/timeout – worth retrying
  const { status } = err.response;
  return status === 429 || (status >= 500 && status < 600);
}

/**
 * Sleep for `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute `fn` with exponential back-off retries on transient errors.
 * @param {Function} fn  Async function to execute.
 * @param {number} [retries]  Remaining retry attempts.
 * @returns {Promise<*>}
 */
async function withRetry(fn, retries = MAX_RETRIES) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && isRetryable(err)) {
      const attempt = MAX_RETRIES - retries + 1;
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      const retryAfter = err.response && err.response.headers && err.response.headers['retry-after'];
      let waitMs = delay;
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds)) {
          waitMs = seconds * 1_000;
        } else {
          // Header may be an HTTP date string
          const retryDate = new Date(retryAfter).getTime();
          if (!isNaN(retryDate)) waitMs = Math.max(0, retryDate - Date.now());
        }
      }
      logger.warn('OpenAI request failed – retrying', {
        attempt,
        waitMs,
        status: err.response ? err.response.status : 'network',
      });
      await sleep(waitMs);
      return withRetry(fn, retries - 1);
    }
    // Normalise OpenAI error messages for upstream callers
    if (err.response && err.response.data && err.response.data.error) {
      const apiErr = new Error(err.response.data.error.message || 'OpenAI API error');
      apiErr.status = err.response.status;
      apiErr.code = err.response.data.error.code;
      throw apiErr;
    }
    throw err;
  }
}

/**
 * Send a chat completion request to the OpenAI API.
 * @param {Array<{role:string, content:string}>} messages  Conversation messages.
 * @param {object} [options]  Extra parameters forwarded to the API.
 * @returns {Promise<{id:string, content:string, model:string, usage:object}>}
 */
async function chat(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const { model: modelOverride, ...rest } = options;
  const payload = {
    model: modelOverride || DEFAULT_MODEL,
    messages,
    ...rest,
  };

  logger.debug('OpenAI chat request', { model: payload.model, messageCount: messages.length });

  const response = await withRetry(() =>
    axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30_000,
      }
    )
  );

  const choice = response.data.choices[0];
  return {
    id: response.data.id,
    content: choice.message.content,
    model: response.data.model,
    usage: response.data.usage,
  };
}

/**
 * List available OpenAI models.
 * @returns {Promise<Array<{id:string}>>}
 */
async function listModels() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const response = await withRetry(() =>
    axios.get('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15_000,
    })
  );
  return response.data.data;
}

module.exports = { chat, listModels, withRetry, isRetryable };
