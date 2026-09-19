'use strict';

const axios = require('axios');
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

async function chat(messages, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  const model = options.model || DEFAULT_MODEL;
  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(message.content || '') }],
  }));
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    { contents, generationConfig: options.generationConfig || undefined },
    { headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' }, timeout: 60_000 }
  );
  const candidate = response.data.candidates && response.data.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  return {
    provider: 'gemini',
    model,
    content: Array.isArray(parts) ? parts.map((part) => part.text || '').join('') : '',
    usage: response.data.usageMetadata || {},
  };
}

module.exports = { chat };
