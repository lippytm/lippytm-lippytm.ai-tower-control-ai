const assert = require('assert');
const { recommendPromotionStage } = require('../../src/fleet/promotion_advisor');

const result = recommendPromotionStage({
  currentStage: 1,
  hasDocs: true,
  hasQualityGates: true,
  hasValueModel: true,
  hasIntegrations: true,
});

assert.strictEqual(result.recommendedStage, 4);
assert.strictEqual(result.readyForPromotion, true);
assert.deepStrictEqual(result.blockers, []);
