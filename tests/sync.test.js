'use strict';

const { scheduleSync, getSyncJob, listSyncJobs, CONNECTORS, _resetJobsForTests } = require('../src/data-management/sync');

beforeEach(() => {
  _resetJobsForTests();
});

describe('CONNECTORS list', () => {
  it('includes all expected connectors', () => {
    expect(CONNECTORS).toContain('openai');
    expect(CONNECTORS).toContain('allbots');
    expect(CONNECTORS).toContain('factory-ai');
    expect(CONNECTORS).toContain('replit');
    expect(CONNECTORS).toContain('github-copilot');
  });
});

describe('scheduleSync', () => {
  it('throws on unknown source connector', () => {
    expect(() => scheduleSync('unknown-src', 'openai')).toThrow(/Unknown source connector/);
  });

  it('throws on unknown target connector', () => {
    expect(() => scheduleSync('openai', 'unknown-tgt')).toThrow(/Unknown target connector/);
  });

  it('creates a job with pending status', () => {
    const job = scheduleSync('openai', 'allbots');
    expect(job).toHaveProperty('jobId');
    expect(job.status).toBe('pending');
    expect(job.source).toBe('openai');
    expect(job.target).toBe('allbots');
    expect(job).toHaveProperty('createdAt');
    expect(job.mode).toBe('simulation');
  });

  it('does not claim real sync success after simulation finishes', async () => {
    const { jobId } = scheduleSync('openai', 'swarm');
    await new Promise((resolve) => setTimeout(resolve, 600));
    const job = getSyncJob(jobId);
    expect(job.status).toBe('simulated');
    expect(job.result).toMatchObject({ recordsSynced: 0, message: expect.stringContaining('no records') });
  });

  it('rejects production dispatch unless the operator explicitly enables simulation', () => {
    const previous = { nodeEnv: process.env.NODE_ENV, simulation: process.env.ENABLE_SYNC_SIMULATION };
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.ENABLE_SYNC_SIMULATION;
      expect(() => scheduleSync('openai', 'swarm')).toThrow(/not implemented/);
      expect(listSyncJobs()).toEqual([]);
      process.env.ENABLE_SYNC_SIMULATION = 'true';
      expect(scheduleSync('openai', 'swarm').mode).toBe('simulation');
    } finally {
      if (previous.nodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previous.nodeEnv;
      if (previous.simulation === undefined) delete process.env.ENABLE_SYNC_SIMULATION;
      else process.env.ENABLE_SYNC_SIMULATION = previous.simulation;
    }
  });

  it.each([null, [], 'invalid'])('rejects malformed options %#', (options) => {
    expect(() => scheduleSync('openai', 'swarm', options)).toThrow(/options must/);
  });

  it('does not expose mutable sync state through arguments or results', () => {
    const options = { filter: { name: 'original' } };
    const { jobId } = scheduleSync('openai', 'swarm', options);
    options.filter.name = 'changed';
    getSyncJob(jobId).options.filter.name = 'changed-again';
    expect(getSyncJob(jobId).options.filter.name).toBe('original');
  });
});

describe('getSyncJob', () => {
  it('returns the job by id', () => {
    const { jobId } = scheduleSync('replit', 'factory-ai');
    const job = getSyncJob(jobId);
    expect(job.jobId).toBe(jobId);
  });

  it('throws when job is not found', () => {
    expect(() => getSyncJob('nonexistent-id')).toThrow(/Sync job not found/);
  });
});

describe('listSyncJobs', () => {
  it('returns an array', () => {
    const jobs = listSyncJobs();
    expect(Array.isArray(jobs)).toBe(true);
  });

  it('includes previously created jobs', () => {
    const { jobId } = scheduleSync('github-copilot', 'openai');
    const jobs = listSyncJobs();
    expect(jobs.some((j) => j.jobId === jobId)).toBe(true);
  });
});
