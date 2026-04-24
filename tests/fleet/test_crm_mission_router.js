const assert = require('assert');
const { missionFromCrmEvent, buildCrmMission } = require('../../src/fleet/crm_mission_router');

assert.strictEqual(missionFromCrmEvent({ event_type: 'lead.premium_routed' }).missionType, 'premium_activation');
assert.strictEqual(missionFromCrmEvent({ event_type: 'service.activated' }).missionType, 'retention_followup');
assert.strictEqual(missionFromCrmEvent({ event_type: 'lead.qualified' }).missionType, 'lead_routing');

const mission = buildCrmMission({ event_type: 'lead.reengaged', contact_id: 'contact_1' });
assert.strictEqual(mission.missionType, 'reengagement');
assert.strictEqual(mission.contactId, 'contact_1');
assert.strictEqual(mission.nextPhase, 'govern');
