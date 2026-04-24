function missionFromAffiliateSignal(signal = {}) {
  const type = signal.type || 'unknown';

  if (type === 'affiliate_quality_drop') {
    return {
      missionType: 'affiliate_quality',
      recommendedActions: ['review affiliate-origin lead quality', 'review premium-path clarity'],
    };
  }

  if (type === 'affiliate_activation_gap') {
    return {
      missionType: 'affiliate_activation',
      recommendedActions: ['review affiliate activation flow', 'review checkout and service handoff'],
    };
  }

  if (type === 'affiliate_followup_gap') {
    return {
      missionType: 'affiliate_followup',
      recommendedActions: ['review affiliate follow-up timing', 'review partner-origin routing context'],
    };
  }

  if (type === 'affiliate_repeat_value_drop') {
    return {
      missionType: 'affiliate_retention',
      recommendedActions: ['review repeat-value path', 'review customer expansion fit'],
    };
  }

  return {
    missionType: 'affiliate_general',
    recommendedActions: ['review affiliate signal and choose bounded mission'],
  };
}

function buildAffiliateMission(signal = {}) {
  const derived = missionFromAffiliateSignal(signal);
  return {
    missionId: `affiliate_mission_${Date.now()}`,
    signalType: signal.type || 'unknown',
    sourcePartnerId: signal.partner_id || 'unknown',
    missionType: derived.missionType,
    recommendedActions: derived.recommendedActions,
    nextPhase: 'govern',
  };
}

module.exports = {
  missionFromAffiliateSignal,
  buildAffiliateMission,
};
