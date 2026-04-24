const assert = require('assert');
const { missionFromPartnerSignal, buildPartnerMission } = require('../../src/fleet/partner_signal_router');

assert.strictEqual(missionFromPartnerSignal({ type: 'partner.lead' }).missionType, 'partner_routing');
assert.strictEqual(missionFromPartnerSignal({ type: 'partner.active' }).missionType, 'partner_activation');
assert.strictEqual(missionFromPartnerSignal({ type: 'partner.followup' }).missionType, 'partner_followup');
assert.strictEqual(missionFromPartnerSignal({ type: 'partner.routed' }).missionType, 'affiliate_clarity');

const mission = buildPartnerMission({ type: 'partner.lead', partner_id: 'partner_1' });
assert.strictEqual(mission.partnerId, 'partner_1');
assert.strictEqual(mission.missionType, 'partner_routing');
assert.strictEqual(mission.nextPhase, 'govern');
