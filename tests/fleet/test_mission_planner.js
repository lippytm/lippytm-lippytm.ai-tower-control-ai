const assert = require('assert');
const { classifyMissionType, suggestLaneTargets, buildMissionPlan } = require('../../src/fleet/mission_planner');

assert.strictEqual(classifyMissionType('Improve revenue funnel'), 'revenue_optimization');
assert.strictEqual(classifyMissionType('Upgrade payment checkout'), 'commerce_activation');
assert.deepStrictEqual(suggestLaneTargets('repo_manufacturing'), ['hub', 'control', 'swarm', 'product']);

const plan = buildMissionPlan({ goal: 'Improve repo docs', repos: ['lippytm/lippytm.ai'] });
assert.ok(plan.missionId.startsWith('mission_'));
assert.strictEqual(plan.missionType, 'repo_manufacturing');
assert.ok(plan.targetRepos.includes('lippytm/lippytm.ai'));
