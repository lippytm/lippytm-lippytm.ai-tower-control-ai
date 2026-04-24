function recommendLane(objective = '') {
  const text = objective.toLowerCase();
  if (text.includes('policy') || text.includes('standard')) return 'hub';
  if (text.includes('orchestr') || text.includes('rollout')) return 'control';
  if (text.includes('route') || text.includes('swarm') || text.includes('agent')) return 'swarm';
  if (text.includes('offer') || text.includes('lead') || text.includes('funnel')) return 'revenue';
  if (text.includes('payment') || text.includes('checkout') || text.includes('subscription')) return 'commerce';
  if (text.includes('course') || text.includes('media') || text.includes('education')) return 'knowledge';
  if (text.includes('experiment') || text.includes('prototype')) return 'lab';
  return 'product';
}

function routeObjective(objective, reposByLane = {}) {
  const lane = recommendLane(objective);
  return {
    lane,
    recommendedRepos: reposByLane[lane] || [],
    escalationRequired: false,
  };
}

module.exports = {
  recommendLane,
  routeObjective
};
