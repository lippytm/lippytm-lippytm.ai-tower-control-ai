'use strict';

const { generateToken, verifyToken, requireAuth } = require('../src/security/auth');

describe('generateToken / verifyToken', () => {
  it('generates a token that can be verified', () => {
    const token = generateToken({ clientId: 'test-client', role: 'api-consumer' });
    expect(typeof token).toBe('string');
    const decoded = verifyToken(token);
    expect(decoded.clientId).toBe('test-client');
    expect(decoded.role).toBe('api-consumer');
  });

  describe('production signing configuration', () => {
    const originalEnvironment = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnvironment };
    });

    it.each([undefined, 'short', 'CHANGEME_REPLACE_WITH_32_PLUS_RANDOM_CHARS'])(
      'refuses to load with an unsafe production signing secret: %s',
      (secret) => {
        process.env.NODE_ENV = 'production';
        if (secret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = secret;
        expect(() => jest.isolateModules(() => require('../src/security/auth')))
          .toThrow(/Production requires/);
      }
    );

    it('loads with a configured production signing secret', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'production-test-only-signing-secret-123456789';
      expect(() => jest.isolateModules(() => require('../src/security/auth'))).not.toThrow();
    });

    it('refuses token issuance and verification with development defaults', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.JWT_SECRET;
      jest.isolateModules(() => {
        const auth = require('../src/security/auth');
        expect(() => auth.generateToken({ clientId: 'test' })).toThrow(/not configured/);
        expect(() => auth.verifyToken('any-token')).toThrow(/not configured/);
      });
    });
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
