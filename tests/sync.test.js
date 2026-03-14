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
    expect(CONNECTORS).toContain('perplexity');
    expect(CONNECTORS).toContain('botbuilders');
    expect(CONNECTORS).toContain('manychat');
    expect(CONNECTORS).toContain('kartra');
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
