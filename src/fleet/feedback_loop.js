function summarizeSignals(signals = []) {
  return {
    totalSignals: signals.length,
    byType: signals.reduce((acc, signal) => {
      const key = signal.type || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  };
}

function recommendLoopActions(signals = []) {
  const actions = [];
  const types = new Set(signals.map((signal) => signal.type));

  if (types.has('missing_docs')) {
    actions.push('start documentation improvement mission');
  }
  if (types.has('test_gap')) {
    actions.push('start quality improvement mission');
  }
  if (types.has('routing_failure')) {
    actions.push('start swarm routing review mission');
  }
  if (types.has('conversion_gap')) {
    actions.push('start revenue optimization mission');
  }

  if (actions.length === 0) {
    actions.push('record and monitor');
  }

  return actions;
}

function buildFeedbackLoopReport(signals = []) {
  return {
    loopId: `loop_${Date.now()}`,
    summary: summarizeSignals(signals),
    recommendedActions: recommendLoopActions(signals),
    nextPhase: 'govern',
  };
}

module.exports = {
  summarizeSignals,
  recommendLoopActions,
  buildFeedbackLoopReport,
};
