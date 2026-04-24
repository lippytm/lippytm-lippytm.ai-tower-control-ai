function buildPromotionLoop(signals = []) {
  const promotionSignals = signals.filter((signal) => ['promotion_blocker', 'promotion_ready', 'lane_mismatch'].includes(signal.type));
  return {
    loopType: 'promotion',
    totalSignals: promotionSignals.length,
    recommendedActions: promotionSignals.map((signal) => `review ${signal.type}`),
    nextPhase: 'govern',
  };
}

module.exports = {
  buildPromotionLoop,
};
