'use strict';

const request = require('supertest');
const app = require('../src/server');
const { verifyGithubSignature } = require('../src/routes/webhook');
const crypto = require('crypto');

// ── verifyGithubSignature unit tests ─────────────────────────────────────────

describe('verifyGithubSignature', () => {
  const secret = 'my-webhook-secret';
  const body = '{"action":"push"}';

  function makeSignature(s, b) {
    return `sha256=${crypto.createHmac('sha256', s).update(b).digest('hex')}`;
  }

  it('returns false when signature is missing', () => {
    expect(verifyGithubSignature(secret, body, undefined)).toBe(false);
    expect(verifyGithubSignature(secret, body, '')).toBe(false);
  });

  it('returns true for a correct signature', () => {
    const sig = makeSignature(secret, body);
    expect(verifyGithubSignature(secret, body, sig)).toBe(true);
  });

  it('returns false for a tampered signature', () => {
    const sig = makeSignature(secret, body) + 'x';
    expect(verifyGithubSignature(secret, body, sig)).toBe(false);
  });

  it('returns false when body differs from signed body', () => {
    const sig = makeSignature(secret, '{"action":"other"}');
    expect(verifyGithubSignature(secret, body, sig)).toBe(false);
  });
});

// ── Webhook HTTP routes ───────────────────────────────────────────────────────

describe('POST /api/webhooks/github', () => {
  it('returns 200 and echoes event details when no secret is set', async () => {
    delete process.env.GITHUB_WEBHOOK_SECRET;

    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'push')
      .set('x-github-delivery', 'delivery-123')
      .send({ ref: 'refs/heads/main' });

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
    expect(res.body.event).toBe('push');
    expect(res.body.delivery).toBe('delivery-123');
  });

  it('returns 401 when secret is set but signature is wrong', async () => {
    process.env.GITHUB_WEBHOOK_SECRET = 'super-secret';

    const res = await request(app)
      .post('/api/webhooks/github')
      .set('x-github-event', 'push')
      .set('x-hub-signature-256', 'sha256=invalidsignature')
      .send({ ref: 'refs/heads/main' });

    expect(res.status).toBe(401);
    delete process.env.GITHUB_WEBHOOK_SECRET;
  });

  it('returns 200 when secret is set and signature is correct', async () => {
    const secret = 'super-secret';
    process.env.GITHUB_WEBHOOK_SECRET = secret;

    const body = JSON.stringify({ ref: 'refs/heads/main' });
    const sig = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;

    const res = await request(app)
      .post('/api/webhooks/github')
      .set('Content-Type', 'application/json')
      .set('x-github-event', 'push')
      .set('x-hub-signature-256', sig)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
    delete process.env.GITHUB_WEBHOOK_SECRET;
  });
});

describe('POST /api/webhooks/factory-ai', () => {
  it('returns 200 with received:true', async () => {
    const res = await request(app)
      .post('/api/webhooks/factory-ai')
      .send({ pipelineId: 'p1', runId: 'r1', status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});

describe('POST /api/webhooks/allbots', () => {
  it('returns 200 with received:true', async () => {
    const res = await request(app)
      .post('/api/webhooks/allbots')
      .send({ botId: 'bot-42', event: 'message.received' });

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});
