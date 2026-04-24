function buildReadinessLoop(repos = []) {
  const lowScoreRepos = repos.filter((repo) => (repo.score || 0) < 70);
  const highRiskLowScore = lowScoreRepos.filter((repo) => ['high', 'critical'].includes(repo.riskLevel));

  return {
    loopType: 'readiness',
    totalRepos: repos.length,
    lowScoreCount: lowScoreRepos.length,
    highRiskLowScoreCount: highRiskLowScore.length,
    recommendedActions: [
      ...(highRiskLowScore.length ? ['prioritize high-risk low-score repos'] : []),
      ...(lowScoreRepos.length ? ['create readiness missions from scorecard gaps'] : []),
      ...(lowScoreRepos.length === 0 ? ['continue readiness monitoring'] : []),
    ],
    nextPhase: 'govern',
  };
}

module.exports = {
  buildReadinessLoop,
};
