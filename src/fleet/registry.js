const DEFAULT_REPOS = [
  {
    repo: 'lippytm/lippytm.ai',
    lane: 'hub',
    nodeClass: 'authority',
    riskLevel: 'critical',
    publicSurface: false,
    fleetManaged: true,
    brainkitManaged: true,
    telemetryEnabled: true
  },
  {
    repo: 'lippytm/lippytm-lippytm.ai-tower-control-ai',
    lane: 'control',
    nodeClass: 'orchestrator',
    riskLevel: 'critical',
    publicSurface: false,
    fleetManaged: true,
    brainkitManaged: true,
    telemetryEnabled: true
  },
  {
    repo: 'lippytm/MyClaw.lippytm.AI-',
    lane: 'swarm',
    nodeClass: 'executor',
    riskLevel: 'high',
    publicSurface: false,
    fleetManaged: true,
    brainkitManaged: false,
    telemetryEnabled: true
  },
  {
    repo: 'lippytm/lippytmai.getbizfunds.com-',
    lane: 'revenue',
    nodeClass: 'interface',
    riskLevel: 'high',
    publicSurface: true,
    fleetManaged: true,
    brainkitManaged: false,
    telemetryEnabled: true
  },
  {
    repo: 'lippytm/Web3AI',
    lane: 'commerce',
    nodeClass: 'commerce',
    riskLevel: 'critical',
    publicSurface: true,
    fleetManaged: true,
    brainkitManaged: false,
    telemetryEnabled: true
  }
];

function normalizeRepoRecord(record) {
  const input = record || {};
  return {
    repo: input.repo,
    lane: input.lane || 'lab',
    nodeClass: input.nodeClass || 'lab',
    riskLevel: input.riskLevel || 'low',
    publicSurface: Boolean(input.publicSurface),
    fleetManaged: input.fleetManaged !== false,
    brainkitManaged: Boolean(input.brainkitManaged),
    telemetryEnabled: input.telemetryEnabled !== false,
    owner: input.owner || 'lippytm',
    description: input.description || '',
    tags: Array.isArray(input.tags) ? input.tags : [],
    integrations: Array.isArray(input.integrations) ? input.integrations : [],
    metadata: input.metadata || {}
  };
}

class FleetRegistry {
  constructor(seed) {
    this.records = new Map();
    const items = Array.isArray(seed) ? seed : DEFAULT_REPOS;
    items.map(normalizeRepoRecord).forEach((record) => {
      this.records.set(record.repo, record);
    });
  }

  listAll() {
    return Array.from(this.records.values());
  }

  listByLane(lane) {
    return this.listAll().filter((record) => record.lane === lane);
  }

  listPublicSurfaces() {
    return this.listAll().filter((record) => record.publicSurface);
  }

  get(repo) {
    return this.records.get(repo) || null;
  }

  has(repo) {
    return this.records.has(repo);
  }

  register(record) {
    const normalized = normalizeRepoRecord(record);
    if (!normalized.repo) {
      throw new Error('FleetRegistry register requires repo field');
    }
    this.records.set(normalized.repo, normalized);
    return normalized;
  }

  update(repo, patch) {
    const existing = this.get(repo);
    if (!existing) {
      throw new Error('FleetRegistry update could not find repo');
    }
    const updated = normalizeRepoRecord(Object.assign({}, existing, patch || {}, { repo }));
    this.records.set(repo, updated);
    return updated;
  }

  remove(repo) {
    return this.records.delete(repo);
  }

  summary() {
    const all = this.listAll();
    return {
      totalRepos: all.length,
      byLane: all.reduce((acc, record) => {
        acc[record.lane] = (acc[record.lane] || 0) + 1;
        return acc;
      }, {}),
      publicSurfaces: all.filter((record) => record.publicSurface).length,
      criticalRepos: all.filter((record) => record.riskLevel === 'critical').length,
      telemetryEnabled: all.filter((record) => record.telemetryEnabled).length
    };
  }
}

module.exports = {
  DEFAULT_REPOS,
  FleetRegistry,
  normalizeRepoRecord
};
