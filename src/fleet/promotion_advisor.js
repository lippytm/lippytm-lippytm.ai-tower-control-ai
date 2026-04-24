function recommendPromotionStage({ currentStage = 0, hasDocs = false, hasQualityGates = false, hasValueModel = false, hasIntegrations = false }) {
  const blockers = [];

  if (!hasDocs) blockers.push('missing_docs');
  if (!hasQualityGates) blockers.push('missing_quality_gates');
  if (!hasValueModel) blockers.push('missing_value_model');
  if (!hasIntegrations) blockers.push('missing_integration_boundaries');

  let recommendedStage = currentStage;
  if (currentStage < 2 && hasDocs) recommendedStage = 2;
  if (currentStage < 3 && hasDocs && hasQualityGates && hasValueModel) recommendedStage = 3;
  if (currentStage < 4 && blockers.length === 0) recommendedStage = 4;

  return {
    currentStage,
    recommendedStage,
    blockers,
    readyForPromotion: blockers.length === 0 && recommendedStage > currentStage,
  };
}

module.exports = {
  recommendPromotionStage
};
