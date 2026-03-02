'use strict';

const axios = require('axios');
const logger = require('../logger');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

/**
 * Send a chat completion request to the OpenAI API.
 * @param {Array<{role:string, content:string}>} messages  Conversation messages.
 * @param {object} [options]  Extra parameters forwarded to the API.
 * @returns {Promise<{id:string, content:string, model:string, usage:object}>}
 */
async function chat(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const payload = {
    model: options.model || DEFAULT_MODEL,
    messages,
    ...options,
  };

  logger.debug('OpenAI chat request', { model: payload.model, messageCount: messages.length });

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    payload,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    }
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

  const response = await axios.get('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 15_000,
  });
  return response.data.data;
}

module.exports = { chat, listModels };
