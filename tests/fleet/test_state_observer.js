const assert = require('assert');
const { observeRepoState, summarizeRepoStates } = require('../../src/fleet/state_observer');

const state = observeRepoState({
  repo: 'lippytm/lippytm.ai',
  lane: 'hub',
  promotionStage: 5,
  riskLevel: 'critical',
  currentMissionId: 'mission_1'
});

assert.strictEqual(state.lane, 'hub');
assert.strictEqual(state.current_mission_id, 'mission_1');

const summary = summarizeRepoStates([state]);
assert.strictEqual(summary.total, 1);
assert.strictEqual(summary.byLane.hub, 1);
assert.strictEqual(summary.activeMissions, 1);
