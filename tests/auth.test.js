'use strict';

const { generateToken, verifyToken, requireAuth } = require('../src/security/auth');

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
