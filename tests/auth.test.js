'use strict';

const { generateToken, verifyToken, requireAuth, verifyWebhookSignature } = require('../src/security/auth');
const crypto = require('crypto');

// Override JWT_SECRET for deterministic tests
process.env.JWT_SECRET = 'test-secret-1234';

describe('generateToken / verifyToken', () => {
  it('generates a token that can be verified', () => {
    const token = generateToken({ clientId: 'test-client', role: 'api-consumer' });
    expect(typeof token).toBe('string');
    const decoded = verifyToken(token);
    expect(decoded.clientId).toBe('test-client');
    expect(decoded.role).toBe('api-consumer');
  });

  it('throws on tampered token', () => {
    const token = generateToken({ clientId: 'x' });
    expect(() => verifyToken(token + 'tampered')).toThrow();
  });
});

describe('requireAuth middleware', () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } };
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and attaches user when token is valid', () => {
    const token = generateToken({ clientId: 'valid-client' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.clientId).toBe('valid-client');
  });
});

describe('verifyWebhookSignature', () => {
  const secret = 'test-webhook-secret';
  const body = Buffer.from('{"event":"test"}');

  function signBody(b, s) {
    return 'sha256=' + crypto.createHmac('sha256', s).update(b).digest('hex');
  }

  it('returns true for a valid signature', () => {
    const sig = signBody(body, secret);
    expect(verifyWebhookSignature(body, sig, secret)).toBe(true);
  });

  it('returns false for a tampered body', () => {
    const sig = signBody(body, secret);
    expect(verifyWebhookSignature(Buffer.from('tampered'), sig, secret)).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    const sig = signBody(body, 'wrong-secret');
    expect(verifyWebhookSignature(body, sig, secret)).toBe(false);
  });

  it('returns false when signatureHeader is missing', () => {
    expect(verifyWebhookSignature(body, '', secret)).toBe(false);
  });

  it('returns false when secret is not provided and WEBHOOK_SECRET is not set', () => {
    delete process.env.WEBHOOK_SECRET;
    const sig = signBody(body, secret);
    expect(verifyWebhookSignature(body, sig)).toBe(false);
  });

  it('returns false for unsupported algorithm prefix', () => {
    const sig = 'sha1=abc123';
    expect(verifyWebhookSignature(body, sig, secret)).toBe(false);
  });
});
