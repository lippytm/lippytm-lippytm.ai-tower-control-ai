const assert = require('assert');
const { missionTypeFromRepo, buildMissionFromScorecard } = require('../../src/fleet/mission_from_scorecard');

assert.strictEqual(missionTypeFromRepo({ awarenessPresent: false }), 'awareness_completion');
assert.strictEqual(missionTypeFromRepo({ awarenessPresent: true, score: 50, riskLevel: 'critical' }), 'quality_readiness');
assert.strictEqual(missionTypeFromRepo({ awarenessPresent: true, score: 90, laneMismatch: true }), 'lane_resolution');

const mission = buildMissionFromScorecard({
  repo: 'lippytm/example',
  awarenessPresent: true,
  score: 40,
  riskLevel: 'high',
  primaryLane: 'product'
});

assert.strictEqual(mission.missionType, 'quality_readiness');
assert.strictEqual(mission.primaryLane, 'product');
assert.strictEqual(mission.nextPhase, 'govern');
