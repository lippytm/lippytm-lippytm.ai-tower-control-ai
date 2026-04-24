const assert = require('assert');
const { buildReadinessLoop } = require('../../src/fleet/readiness_loop');

const result = buildReadinessLoop([
  { score: 50, riskLevel: 'critical' },
  { score: 65, riskLevel: 'high' },
  { score: 90, riskLevel: 'low' }
]);

assert.strictEqual(result.loopType, 'readiness');
assert.strictEqual(result.lowScoreCount, 2);
assert.strictEqual(result.highRiskLowScoreCount, 2);
assert.strictEqual(result.nextPhase, 'govern');
