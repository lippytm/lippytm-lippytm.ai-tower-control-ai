const assert = require('assert');
const { buildQualityLoop } = require('../../src/fleet/quality_loop');

const result = buildQualityLoop([
  { type: 'missing_docs' },
  { type: 'test_gap' },
  { type: 'conversion_gap' }
]);

assert.strictEqual(result.loopType, 'quality');
assert.strictEqual(result.totalSignals, 2);
assert.strictEqual(result.nextPhase, 'govern');
assert.ok(result.recommendedActions.length >= 1);
