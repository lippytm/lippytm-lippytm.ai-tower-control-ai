'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');

process.env.JWT_SECRET = 'test-secret-1234';

const auth = () => ['Bearer', generateToken({ clientId: 'test', role: 'api-consumer' })].join(' ');

describe('Jarvis Assistant API', () => {
  describe('GET /api/jarvis/tools', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/jarvis/tools');
      expect(res.status).toBe(401);
    });

    it('returns free tool catalog with token', async () => {
      const res = await request(app)
        .get('/api/jarvis/tools')
        .set('Authorization', auth());

      expect(res.status).toBe(200);
      expect(res.body.assistant).toBe('Jarvis');
      expect(res.body.tier).toBe('free');
      expect(Array.isArray(res.body.tools)).toBe(true);
      expect(res.body.tools.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/jarvis/check-in', () => {
    it('returns guidance and protocol for a check-in', async () => {
      const res = await request(app)
        .post('/api/jarvis/check-in')
        .set('Authorization', auth())
        .send({
          goals: ['Ship feature'],
          checkIn: {
            mood: 4,
            stress: 8,
            energy: 3,
            sleepHours: 5,
            blockers: ['Too many open tasks'],
            symptoms: ['Overwhelm'],
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.assistant).toBe('Jarvis');
      expect(res.body.stabilityBand).toBe('recover');
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(Array.isArray(res.body.selfHealingProtocol.immediate)).toBe(true);
    });

    it('sanitizes goals, blockers, and symptoms', async () => {
      const res = await request(app)
        .post('/api/jarvis/check-in')
        .set('Authorization', auth())
        .send({
          goals: ['  Ship feature \u0000  '],
          checkIn: {
            blockers: ['\u0007 noisy blocker \u0000'],
            symptoms: [' panic\u0000 '],
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.recommendations.some((item) => item.includes('Ship feature'))).toBe(true);
      expect(res.body.signals.blockers).toEqual(['noisy blocker']);
      expect(res.body.signals.symptoms).toEqual(['panic']);
    });
  });

  describe('POST /api/jarvis/self-heal', () => {
    it('returns focused self-healing output', async () => {
      const res = await request(app)
        .post('/api/jarvis/self-heal')
        .set('Authorization', auth())
        .send({
          checkIn: {
            mood: 5,
            stress: 7,
            energy: 4,
            sleepHours: 5,
            symptoms: ['panic'],
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.assistant).toBe('Jarvis');
      expect(res.body).toHaveProperty('selfHealingProtocol');
      expect(Array.isArray(res.body.recommendedTools)).toBe(true);
      expect(res.body.recommendedTools.length).toBeGreaterThan(0);
      const toolIds = res.body.recommendedTools.map((tool) => tool.id);
      expect(toolIds).toEqual(expect.arrayContaining(['stress-reset-bot', 'sleep-recovery-check']));
      expect(toolIds).not.toContain('journal-coach');
    });
  });
});
