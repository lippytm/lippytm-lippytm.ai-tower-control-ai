'use strict';

const axios = require('axios');

async function generate(prompt, model) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    }
  );
  if (response.data.stop_reason !== 'end_turn') {
    throw new Error('Claude did not return a complete text response');
  }
  const content = (response.data.content || [])
    .filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text).join('');
  return { id: response.data.id, content, model: response.data.model, usage: response.data.usage };
}

module.exports = { generate };
