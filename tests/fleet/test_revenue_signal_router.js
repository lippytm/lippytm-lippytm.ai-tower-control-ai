const assert = require('assert');
const { missionFromRevenueSignal, buildRevenueMission } = require('../../src/fleet/revenue_signal_router');

assert.strictEqual(missionFromRevenueSignal({ type: 'conversion_gap' }).missionType, 'revenue_clarity');
assert.strictEqual(missionFromRevenueSignal({ type: 'checkout_friction' }).missionType, 'checkout_handoff');
assert.strictEqual(missionFromRevenueSignal({ type: 'premium_path_gap' }).missionType, 'premium_activation');
assert.strictEqual(missionFromRevenueSignal({ type: 'retention_drop' }).missionType, 'retention_followup');

const mission = buildRevenueMission({ type: 'conversion_gap', repo: 'lippytm/lippytmai.getbizfunds.com-' });
assert.strictEqual(mission.repo, 'lippytm/lippytmai.getbizfunds.com-');
assert.strictEqual(mission.missionType, 'revenue_clarity');
assert.strictEqual(mission.nextPhase, 'govern');
