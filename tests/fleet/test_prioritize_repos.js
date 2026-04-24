const assert = require('assert');
const { priorityScore, prioritizeRepos } = require('../../src/fleet/prioritize_repos');

const criticalPublic = {
  repo: 'a',
  riskLevel: 'critical',
  publicSurface: true,
  valueRole: 'direct',
  score: 40,
  promotionStage: 4
};

const lowRiskInternal = {
  repo: 'b',
  riskLevel: 'low',
  publicSurface: false,
  valueRole: 'experimental',
  score: 90,
  promotionStage: 1
};

assert.ok(priorityScore(criticalPublic) > priorityScore(lowRiskInternal));

const ordered = prioritizeRepos([lowRiskInternal, criticalPublic]);
assert.strictEqual(ordered[0].repo, 'a');
assert.ok(ordered[0].priorityScore >= ordered[1].priorityScore);
