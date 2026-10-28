'use strict';

const fs = require('fs');
const { createTowerClient } = require('./tower-client');

async function runWorkflow(env = process.env, request = fetch) {
  const client = createTowerClient(env, request);
  const providers = ['openai', 'gemini', 'claude'];
  if (!providers.includes(env.BUILDER_PROVIDER) || !providers.includes(env.REVIEWER_PROVIDER)) {
    throw new Error('Builder and reviewer must be openai, gemini, or claude');
  }
  if (typeof env.AI_PROMPT !== 'string' || !env.AI_PROMPT.trim() || env.AI_PROMPT.length > 12000) {
    throw new Error('AI_PROMPT must contain 1 to 12000 characters of non-empty text');
  }
  const result = await client.dispatch('/api/workflows/build-review', {
    prompt: env.AI_PROMPT,
    builder: { provider: env.BUILDER_PROVIDER },
    reviewer: { provider: env.REVIEWER_PROVIDER },
  });
  if (result?.status !== 'awaiting_human_review' || result.externalActionsExecuted !== false ||
      typeof result.draft?.content !== 'string' || !result.draft.content.trim() ||
      typeof result.review?.content !== 'string' || !result.review.content.trim()) {
    throw new Error('Workflow returned an invalid draft/review result');
  }
  return result;
}

if (require.main === module) {
  runWorkflow().then((result) => {
    fs.writeFileSync('ai-build-review.json', JSON.stringify(result, null, 2), { mode: 0o600 });
    process.stdout.write('Draft and review saved for human approval; no external actions executed.\n');
  }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { runWorkflow };
