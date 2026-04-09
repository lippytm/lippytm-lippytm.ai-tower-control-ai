'use strict';

const { sanitizeInput, isSafeParam } = require('../src/security/rateLimiter');

describe('sanitizeInput', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(123)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('removes NUL bytes', () => {
    expect(sanitizeInput('hel\0lo')).toBe('hello');
  });

  it('preserves newlines and tabs', () => {
    expect(sanitizeInput('line1\nline2\ttabbed')).toBe('line1\nline2\ttabbed');
  });

  it('passes through normal text unchanged', () => {
    expect(sanitizeInput('Hello, AI Tower!')).toBe('Hello, AI Tower!');
  });

  it('removes ASCII control characters (e.g. BEL, ESC, DEL)', () => {
    // \x07 = BEL, \x1b = ESC, \x7f = DEL
    expect(sanitizeInput('a\x07b\x1bc\x7fd')).toBe('abcd');
  });
});

describe('isSafeParam', () => {
  it('accepts alphanumeric strings', () => {
    expect(isSafeParam('abc123')).toBe(true);
  });

  it('accepts hyphens and underscores', () => {
    expect(isSafeParam('my-bot_01')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isSafeParam('')).toBe(false);
  });

  it('rejects strings with path-traversal sequences', () => {
    expect(isSafeParam('../etc/passwd')).toBe(false);
  });

  it('rejects strings with spaces', () => {
    expect(isSafeParam('hello world')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(isSafeParam(null)).toBe(false);
    expect(isSafeParam(undefined)).toBe(false);
    expect(isSafeParam(123)).toBe(false);
  });

  it('rejects strings longer than 128 characters', () => {
    expect(isSafeParam('a'.repeat(129))).toBe(false);
  });

  it('accepts strings exactly 128 characters long', () => {
    expect(isSafeParam('a'.repeat(128))).toBe(true);
  });
});

