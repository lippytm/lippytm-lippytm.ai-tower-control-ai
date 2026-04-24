function missionFromPartnerSignal(signal = {}) {
  const type = signal.type || 'unknown';

  if (type === 'partner.lead') {
    return {
      missionType: 'partner_routing',
      recommendedActions: ['review partner-origin lead routing', 'confirm correct premium or service path'],
    };
  }

  if (type === 'partner.active') {
    return {
      missionType: 'partner_activation',
      recommendedActions: ['review partner activation flow', 'check follow-up quality'],
    };
  }

  if (type === 'partner.followup') {
    return {
      missionType: 'partner_followup',
      recommendedActions: ['review partner follow-up timing', 'check repeat value potential'],
    };
  }

  if (type === 'partner.routed') {
    return {
      missionType: 'affiliate_clarity',
      recommendedActions: ['review partner path clarity', 'check source-aware routing'],
    };
  }

  return {
    missionType: 'partner_general',
    recommendedActions: ['review partner signal and choose bounded mission'],
  };
}

function buildPartnerMission(signal = {}) {
  const derived = missionFromPartnerSignal(signal);
  return {
    missionId: `partner_mission_${Date.now()}`,
    signalType: signal.type || 'unknown',
    partnerId: signal.partner_id || 'unknown',
    missionType: derived.missionType,
    recommendedActions: derived.recommendedActions,
    nextPhase: 'govern',
  };
}

module.exports = {
  missionFromPartnerSignal,
  buildPartnerMission,
};
