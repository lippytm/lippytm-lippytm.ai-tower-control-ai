const assert = require('assert');
const { buildMonetizationLoop } = require('../../src/fleet/monetization_loop');

const result = buildMonetizationLoop([
  { type: 'conversion_gap' },
  { type: 'offer_gap' },
  { type: 'missing_docs' }
]);

assert.strictEqual(result.loopType, 'monetization');
assert.strictEqual(result.totalSignals, 2);
assert.strictEqual(result.nextPhase, 'govern');
assert.ok(result.recommendedActions.length >= 1);
