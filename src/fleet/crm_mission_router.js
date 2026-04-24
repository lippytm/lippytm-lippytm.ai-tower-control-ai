function missionFromCrmEvent(event = {}) {
  const type = event.event_type || 'unknown';

  if (type === 'lead.premium_routed') {
    return {
      missionType: 'premium_activation',
      recommendedActions: ['review premium activation path', 'confirm assistant or swarm handoff'],
    };
  }

  if (type === 'service.activated') {
    return {
      missionType: 'retention_followup',
      recommendedActions: ['schedule retention follow-up', 'capture delivery context'],
    };
  }

  if (type === 'lead.qualified' || type === 'lead.strategy_routed') {
    return {
      missionType: 'lead_routing',
      recommendedActions: ['review next-step routing', 'confirm correct destination lane'],
    };
  }

  if (type === 'lead.reengaged' || type === 'followup.scheduled') {
    return {
      missionType: 'reengagement',
      recommendedActions: ['review follow-up timing', 'check expansion fit'],
    };
  }

  return {
    missionType: 'crm_general',
    recommendedActions: ['review CRM signal and choose bounded mission'],
  };
}

function buildCrmMission(event = {}) {
  const derived = missionFromCrmEvent(event);
  return {
    missionId: `crm_mission_${Date.now()}`,
    eventType: event.event_type || 'unknown',
    contactId: event.contact_id || 'unknown',
    missionType: derived.missionType,
    recommendedActions: derived.recommendedActions,
    nextPhase: 'govern',
  };
}

module.exports = {
  missionFromCrmEvent,
  buildCrmMission,
};
