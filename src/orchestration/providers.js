'use strict';

const openai = require('../connectors/openai');
const gemini = require('../connectors/gemini');
const claude = require('../connectors/claude');

const providers = { openai, gemini, claude };

function configured(name) {
  if (name === 'openai') return Boolean(process.env.OPENAI_API_KEY);
  if (name === 'gemini') return Boolean(process.env.GEMINI_API_KEY);
  if (name === 'claude') return Boolean(process.env.ANTHROPIC_API_KEY);
  return false;
}

function listProviders() {
  return Object.keys(providers).map((name) => ({ name, configured: configured(name) }));
}

async function runTask({ messages, provider = 'openai', model }) {
  if (!providers[provider]) throw new Error(`Unknown provider: ${provider}`);
  return providers[provider].chat(messages, model ? { model } : {});
}

async function compareTask({ messages, providers: requested, models = {} }) {
  const names = (requested || Object.keys(providers)).filter((name) => providers[name]);
  const settled = await Promise.allSettled(
    names.map((name) => runTask({ messages, provider: name, model: models[name] }))
  );
  return Object.fromEntries(settled.map((result, index) => [
    names[index],
    result.status === 'fulfilled'
      ? { status: 'completed', result: result.value }
      : { status: 'error', error: result.reason.message },
  ]));
}

module.exports = { listProviders, runTask, compareTask };
