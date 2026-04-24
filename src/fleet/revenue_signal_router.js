function missionFromRevenueSignal(signal = {}) {
  const type = signal.type || 'unknown';

  if (type === 'conversion_gap') {
    return {
      missionType: 'revenue_clarity',
      recommendedActions: ['review offer clarity', 'review funnel friction'],
    };
  }

  if (type === 'checkout_friction') {
    return {
      missionType: 'checkout_handoff',
      recommendedActions: ['review checkout handoff', 'review activation context'],
    };
  }

  if (type === 'premium_path_gap') {
    return {
      missionType: 'premium_activation',
      recommendedActions: ['review premium path fit', 'review routing and follow-up'],
    };
  }

  if (type === 'retention_drop') {
    return {
      missionType: 'retention_followup',
      recommendedActions: ['review follow-up timing', 'review customer expansion fit'],
    };
  }

  return {
    missionType: 'revenue_general',
    recommendedActions: ['review revenue signal and choose bounded mission'],
  };
}

function buildRevenueMission(signal = {}) {
  const derived = missionFromRevenueSignal(signal);
  return {
    missionId: `revenue_mission_${Date.now()}`,
    signalType: signal.type || 'unknown',
    repo: signal.repo || 'unknown',
    missionType: derived.missionType,
    recommendedActions: derived.recommendedActions,
    nextPhase: 'govern',
  };
}

module.exports = {
  missionFromRevenueSignal,
  buildRevenueMission,
};
