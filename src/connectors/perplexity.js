'use strict';

const axios = require('axios');
const logger = require('../logger');

const DEFAULT_MODEL = process.env.PERPLEXITY_MODEL || 'sonar';

/**
 * Send a chat / search completion request to the Perplexity API.
 * @param {Array<{role:string, content:string}>} messages  Conversation messages.
 * @param {object} [options]  Extra parameters forwarded to the API.
 * @returns {Promise<{id:string, content:string, model:string, usage:object}>}
 */
async function chat(messages, options = {}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not configured');

  const payload = {
    model: options.model || DEFAULT_MODEL,
    messages,
    ...options,
  };

  logger.debug('Perplexity chat request', { model: payload.model, messageCount: messages.length });

  const response = await axios.post(
    'https://api.perplexity.ai/chat/completions',
    payload,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    }
  );

  const choice = response.data.choices && response.data.choices[0];
  if (!choice) throw new Error('Perplexity API returned no choices');
  return {
    id: response.data.id,
    content: choice.message.content,
    model: response.data.model,
    usage: response.data.usage,
  };
}

/**
 * Convenience wrapper: send a single user query to Perplexity.
 * @param {string} query  The search / question text.
 * @param {object} [options]  Extra parameters (model, etc.).
 * @returns {Promise<{id:string, content:string, model:string, usage:object}>}
 */
async function search(query, options = {}) {
  return chat([{ role: 'user', content: query }], options);
}

module.exports = { chat, search };
