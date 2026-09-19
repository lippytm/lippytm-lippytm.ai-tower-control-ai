'use strict';

const axios = require('axios');
const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';

async function chat(messages, options = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
  const model = options.model || DEFAULT_MODEL;
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
  const conversational = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') }));
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model,
      max_tokens: Number(options.max_tokens || process.env.CLAUDE_MAX_TOKENS || 4096),
      ...(system ? { system } : {}),
      messages: conversational,
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 60_000,
    }
  );
  return {
    provider: 'claude',
    model: response.data.model || model,
    content: (response.data.content || []).filter((item) => item.type === 'text').map((item) => item.text).join(''),
    usage: response.data.usage || {},
  };
}

module.exports = { chat };
