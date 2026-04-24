function missionTypeFromRepo(repo = {}) {
  if (!repo.awarenessPresent) return 'awareness_completion';
  if ((repo.score || 0) < 70 && ['high', 'critical'].includes(repo.riskLevel)) return 'quality_readiness';
  if (repo.laneMismatch === true) return 'lane_resolution';
  if (repo.integrationsPresent === false) return 'integration_readiness';
  return 'general_improvement';
}

function buildMissionFromScorecard(repo = {}) {
  const missionType = missionTypeFromRepo(repo);
  return {
    missionId: `mission_${Date.now()}`,
    repo: repo.repo || 'unknown',
    missionType,
    primaryLane: repo.primaryLane || 'unknown',
    riskLevel: repo.riskLevel || 'low',
    score: repo.score || 0,
    recommendedActions: [
      ...(missionType === 'awareness_completion' ? ['add repo awareness file'] : []),
      ...(missionType === 'quality_readiness' ? ['improve docs, tests, and integration coverage'] : []),
      ...(missionType === 'lane_resolution' ? ['review lane mismatch and reroute work'] : []),
      ...(missionType === 'integration_readiness' ? ['add integration documentation and event flow notes'] : []),
      ...(missionType === 'general_improvement' ? ['review repo for next bounded improvement mission'] : []),
    ],
    nextPhase: 'govern',
  };
}

module.exports = {
  missionTypeFromRepo,
  buildMissionFromScorecard,
};
