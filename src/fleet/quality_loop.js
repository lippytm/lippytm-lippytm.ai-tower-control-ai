function buildQualityLoop(signals = []) {
  const qualitySignals = signals.filter((signal) => ['missing_docs', 'test_gap', 'validation_gap'].includes(signal.type));
  return {
    loopType: 'quality',
    totalSignals: qualitySignals.length,
    recommendedActions: qualitySignals.map((signal) => `review ${signal.type}`),
    nextPhase: 'govern',
  };
}

module.exports = {
  buildQualityLoop,
};
