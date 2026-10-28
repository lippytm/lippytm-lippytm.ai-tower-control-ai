'use strict';

const { createTowerClient } = require('./tower-client');

async function dispatchSync(env = process.env, request = fetch) {
  let payload;
  try {
    payload = JSON.parse(env.SYNC_PAYLOAD || '{}');
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new Error('payload must be valid JSON');
  }
  const supported = ['openai', 'allbots', 'factory-ai', 'replit', 'github-copilot', 'swarm'];
  if (!payload || Array.isArray(payload) || typeof payload !== 'object' ||
      !supported.includes(payload.source) || !supported.includes(payload.target)) {
    throw new Error('payload must specify supported source and target connector names');
  }
  if (env.SYNC_EVENT_TYPE !== `${payload.source}-sync`) {
    throw new Error('event_type must match the source connector followed by -sync');
  }
  const client = createTowerClient(env, request);
  const result = await client.dispatch('/api/data/sync', payload);
  if (typeof result?.jobId !== 'string' || !result.jobId || result.status !== 'pending' ||
      result.mode !== 'simulation') {
    throw new Error('Dispatch returned an invalid simulated sync job');
  }
  return result;
}

if (require.main === module) {
  dispatchSync().then(() => {
    process.stdout.write('Simulation scheduled; no real records are transferred by the sync worker.\n');
  }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { dispatchSync };
