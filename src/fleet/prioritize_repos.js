function priorityScore(repo = {}) {
  let score = 0;
  const risk = repo.riskLevel || 'low';
  const promotionStage = repo.promotionStage || 0;
  const publicSurface = repo.publicSurface === true;
  const valueRole = repo.valueRole || 'experimental';
  const repoScore = repo.score || 0;

  if (risk === 'critical') score += 40;
  else if (risk === 'high') score += 30;
  else if (risk === 'moderate') score += 20;
  else score += 10;

  if (publicSurface) score += 20;
  if (valueRole === 'direct') score += 15;
  else if (valueRole === 'platform') score += 10;
  else if (valueRole === 'supporting') score += 5;

  score += Math.max(0, 30 - Math.min(repoScore, 30));
  score += Math.max(0, 5 - Math.min(promotionStage, 5));

  return score;
}

function prioritizeRepos(repos = []) {
  return [...repos]
    .map((repo) => ({ ...repo, priorityScore: priorityScore(repo) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

module.exports = {
  priorityScore,
  prioritizeRepos,
};
