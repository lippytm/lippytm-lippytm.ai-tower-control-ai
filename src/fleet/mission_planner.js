function classifyMissionType(goal = '') {
  const text = goal.toLowerCase();
  if (text.includes('revenue') || text.includes('funnel') || text.includes('offer')) {
    return 'revenue_optimization';
  }
  if (text.includes('commerce') || text.includes('payment') || text.includes('subscription')) {
    return 'commerce_activation';
  }
  if (text.includes('docs') || text.includes('template') || text.includes('repo')) {
    return 'repo_manufacturing';
  }
  if (text.includes('knowledge') || text.includes('media') || text.includes('course')) {
    return 'knowledge_packaging';
  }
  return 'general_upgrade';
}

function suggestLaneTargets(missionType) {
  const map = {
    repo_manufacturing: ['hub', 'control', 'swarm', 'product'],
    revenue_optimization: ['revenue', 'product', 'commerce'],
    commerce_activation: ['commerce', 'revenue', 'control'],
    knowledge_packaging: ['knowledge', 'revenue', 'product'],
    general_upgrade: ['control', 'swarm', 'product']
  };
  return map[missionType] || ['control'];
}

function buildMissionPlan({ goal, repos = [] }) {
  const missionType = classifyMissionType(goal);
  const lanes = suggestLaneTargets(missionType);
  return {
    missionId: `mission_${Date.now()}`,
    goal,
    missionType,
    suggestedLanes: lanes,
    targetRepos: repos,
    phases: [
      'classify',
      'decompose',
      'route',
      'review',
      'execute',
      'summarize'
    ],
    successCriteria: [
      'targets identified',
      'lane-aware tasks generated',
      'execution path documented'
    ]
  };
}

module.exports = {
  classifyMissionType,
  suggestLaneTargets,
  buildMissionPlan
};
