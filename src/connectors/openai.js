'use strict';

const axios = require('axios');
const logger = require('../logger');
const { validateMessages, requireObject, requireText } = require('../validation');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

/**
 * Send a chat completion request to the OpenAI API.
 * @param {Array<{role:string, content:string}>} messages  Conversation messages.
 * @param {object} [options]  Extra parameters forwarded to the API.
 * @returns {Promise<{id:string, content:string, model:string, usage:object, finishReason:string}>}
 */
async function chat(messages, options = {}) {
  validateMessages(messages);
  requireObject(options, 'options');
  if (options.model !== undefined) requireText(options.model, 'model');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENAI_API_KEY is not configured'), { status: 503 });

  const { model: modelOverride, ...restOptions } = options;
  const payload = {
    model: modelOverride || DEFAULT_MODEL,
    messages,
    ...restOptions,
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

  const choice = response.data?.choices?.[0];
  if (!choice || typeof choice.message?.content !== 'string' || !choice.message.content.trim()) {
    throw Object.assign(new Error('OpenAI returned no text response'), { status: 502 });
  }
  return {
    id: response.data.id,
    content: choice.message.content,
    model: response.data.model,
    usage: response.data.usage,
    finishReason: choice.finish_reason,
  };
}

/**
 * List available OpenAI models.
 * @returns {Promise<Array<{id:string}>>}
 */
async function listModels() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENAI_API_KEY is not configured'), { status: 503 });

  const response = await axios.get('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 15_000,
  });
  if (!Array.isArray(response.data?.data)) {
    throw Object.assign(new Error('OpenAI returned an invalid model list'), { status: 502 });
  }
  return response.data.data;
}

module.exports = { chat, listModels };
