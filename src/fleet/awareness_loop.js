function buildAwarenessLoop(repos = []) {
  const missingAwareness = repos.filter((repo) => !repo.awarenessPresent);
  const laneMismatches = repos.filter((repo) => repo.laneMismatch === true);

  return {
    loopType: 'awareness',
    totalRepos: repos.length,
    missingAwarenessCount: missingAwareness.length,
    laneMismatchCount: laneMismatches.length,
    recommendedActions: [
      ...(missingAwareness.length ? ['add repo awareness files'] : []),
      ...(laneMismatches.length ? ['review lane mismatch cases'] : []),
      ...(missingAwareness.length === 0 && laneMismatches.length === 0 ? ['continue awareness monitoring'] : []),
    ],
    nextPhase: 'govern',
  };
}

module.exports = {
  buildAwarenessLoop,
};
