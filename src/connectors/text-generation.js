'use strict';

const openai = require('./openai');
const gemini = require('./gemini');
const claude = require('./claude');
const logger = require('../logger');

const providers = {
  openai: {
    key: 'OPENAI_API_KEY', model: 'OPENAI_MODEL',
    generate: (prompt, model) => openai.chat(
      [{ role: 'user', content: prompt }], { model, max_completion_tokens: 2048 }
    ),
  },
  gemini: { key: 'GEMINI_API_KEY', model: 'GEMINI_MODEL', generate: gemini.generate },
  claude: { key: 'ANTHROPIC_API_KEY', model: 'CLAUDE_MODEL', generate: claude.generate },
};

function failure(status, message) {
  return Object.assign(new Error(message), { status });
}

function validateRequest(provider, prompt, model) {
  if (typeof provider !== 'string' || !Object.hasOwn(providers, provider)) {
    throw failure(400, 'provider must be openai, gemini, or claude');
  }
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 32000) {
    throw failure(400, 'prompt must contain 1 to 32000 characters of non-empty text');
  }
  if (model !== undefined && (typeof model !== 'string' || !model.trim())) {
    throw failure(400, 'model must be a non-empty string');
  }
  const config = providers[provider];
  const selectedModel = model || process.env[config.model] || (provider === 'openai' ? 'gpt-4o' : '');
  if (!process.env[config.key] || !selectedModel) {
    throw failure(503, `${provider} requires ${config.key} and ${config.model} (or a request model)`);
  }
  if (!/^[a-zA-Z0-9._:-]+$/.test(selectedModel)) {
    throw failure(400, 'model must be a provider model ID, not a URL or path');
  }
  return selectedModel;
}

async function generate(provider, prompt, model) {
  const selectedModel = validateRequest(provider, prompt, model);
  try {
    const result = await providers[provider].generate(prompt, selectedModel);
    if (provider === 'openai' && result.finishReason !== 'stop') {
      throw new Error('OpenAI did not return a complete text response');
    }
    if (typeof result.content !== 'string' || !result.content.trim()) {
      throw new Error('Provider returned no text');
    }
    return result;
  } catch (error) {
    logger.error('Text generation failed', {
      provider, model: selectedModel, upstreamStatus: error.response?.status, code: error.code,
    });
    throw failure(502, `${provider} generation failed; check provider access, limits, and service logs`);
  }
}

module.exports = { generate, validateRequest };
