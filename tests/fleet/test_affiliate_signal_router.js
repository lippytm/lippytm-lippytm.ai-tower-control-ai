const assert = require('assert');
const { missionFromAffiliateSignal, buildAffiliateMission } = require('../../src/fleet/affiliate_signal_router');

assert.strictEqual(missionFromAffiliateSignal({ type: 'affiliate_quality_drop' }).missionType, 'affiliate_quality');
assert.strictEqual(missionFromAffiliateSignal({ type: 'affiliate_activation_gap' }).missionType, 'affiliate_activation');
assert.strictEqual(missionFromAffiliateSignal({ type: 'affiliate_followup_gap' }).missionType, 'affiliate_followup');
assert.strictEqual(missionFromAffiliateSignal({ type: 'affiliate_repeat_value_drop' }).missionType, 'affiliate_retention');

const mission = buildAffiliateMission({ type: 'affiliate_quality_drop', partner_id: 'partner_1' });
assert.strictEqual(mission.sourcePartnerId, 'partner_1');
assert.strictEqual(mission.missionType, 'affiliate_quality');
assert.strictEqual(mission.nextPhase, 'govern');
