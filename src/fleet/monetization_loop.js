function buildMonetizationLoop(signals = []) {
  const monetizationSignals = signals.filter((signal) => ['conversion_gap', 'offer_gap', 'premium_path_gap'].includes(signal.type));
  return {
    loopType: 'monetization',
    totalSignals: monetizationSignals.length,
    recommendedActions: monetizationSignals.map((signal) => `review ${signal.type}`),
    nextPhase: 'govern',
  };
}

module.exports = {
  buildMonetizationLoop,
};
