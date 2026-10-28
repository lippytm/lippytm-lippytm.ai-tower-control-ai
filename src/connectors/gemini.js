'use strict';

const axios = require('axios');

async function generate(prompt, model) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2048 },
    },
    {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
      timeout: 30_000,
    }
  );
  const candidate = response.data.candidates && response.data.candidates[0];
  if (!candidate || candidate.finishReason !== 'STOP') {
    throw new Error('Gemini did not return a complete text response');
  }
  const content = (candidate.content?.parts || [])
    .filter((part) => typeof part.text === 'string' && !part.thought)
    .map((part) => part.text).join('');
  return { content, model, usage: response.data.usageMetadata };
}

module.exports = { generate };
