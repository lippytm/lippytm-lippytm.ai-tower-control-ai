const assert = require('assert');
const { recommendLane, routeObjective } = require('../../src/fleet/lane_router');

assert.strictEqual(recommendLane('Improve checkout flow'), 'commerce');
assert.strictEqual(recommendLane('Create new offer page'), 'revenue');
assert.strictEqual(recommendLane('Build education series'), 'knowledge');

const routed = routeObjective('Improve lead funnel', { revenue: ['lippytm/lippytmai.getbizfunds.com-'] });
assert.strictEqual(routed.lane, 'revenue');
assert.deepStrictEqual(routed.recommendedRepos, ['lippytm/lippytmai.getbizfunds.com-']);
