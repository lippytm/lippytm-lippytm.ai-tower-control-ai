const assert = require('assert');
const { buildPromotionLoop } = require('../../src/fleet/promotion_loop');

const result = buildPromotionLoop([
  { type: 'promotion_blocker' },
  { type: 'promotion_ready' },
  { type: 'conversion_gap' }
]);

assert.strictEqual(result.loopType, 'promotion');
assert.strictEqual(result.totalSignals, 2);
assert.strictEqual(result.nextPhase, 'govern');
assert.ok(result.recommendedActions.length >= 1);
