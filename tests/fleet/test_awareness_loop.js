const assert = require('assert');
const { buildAwarenessLoop } = require('../../src/fleet/awareness_loop');

const result = buildAwarenessLoop([
  { repo: 'a', awarenessPresent: false, laneMismatch: false },
  { repo: 'b', awarenessPresent: true, laneMismatch: true },
  { repo: 'c', awarenessPresent: true, laneMismatch: false }
]);

assert.strictEqual(result.loopType, 'awareness');
assert.strictEqual(result.missingAwarenessCount, 1);
assert.strictEqual(result.laneMismatchCount, 1);
assert.strictEqual(result.nextPhase, 'govern');
