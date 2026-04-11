'use strict';

const { sanitizeInput } = require('../src/security/rateLimiter');

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

  it('removes other non-printable control characters', () => {
    // \x01 (SOH), \x08 (BS), \x0B (VT), \x1F (US) should be stripped
    expect(sanitizeInput('\x01hello\x08world\x1F')).toBe('helloworld');
  });

  it('preserves newlines, carriage returns, and tabs', () => {
    expect(sanitizeInput('line1\nline2\r\n\ttabbed')).toBe('line1\nline2\r\n\ttabbed');
  });

  it('passes through normal text unchanged', () => {
    expect(sanitizeInput('Hello, AI Tower!')).toBe('Hello, AI Tower!');
  });
});
