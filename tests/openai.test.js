'use strict';

const { isRetryable, withRetry } = require('../src/connectors/openai');

describe('isRetryable', () => {
  it('returns true for network errors (no response)', () => {
    expect(isRetryable(new Error('ECONNRESET'))).toBe(true);
  });

  it('returns true for 429 rate-limit responses', () => {
    expect(isRetryable({ response: { status: 429 } })).toBe(true);
  });

  it('returns true for 500 server errors', () => {
    expect(isRetryable({ response: { status: 500 } })).toBe(true);
  });

  it('returns true for 503 server errors', () => {
    expect(isRetryable({ response: { status: 503 } })).toBe(true);
  });

  it('returns false for 400 client errors', () => {
    expect(isRetryable({ response: { status: 400 } })).toBe(false);
  });

  it('returns false for 401 unauthorised', () => {
    expect(isRetryable({ response: { status: 401 } })).toBe(false);
  });
});

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable errors and eventually succeeds', async () => {
    const retryableErr = { response: { status: 503, headers: {} } };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(retryableErr)
      .mockResolvedValue('recovered');

    // Speed up back-off by mocking sleep
    jest.useFakeTimers();
    const promise = withRetry(fn, 1);
    // Advance timers to skip the back-off delay
    await jest.runAllTimersAsync();
    const result = await promise;
    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('throws after exhausting retries', async () => {
    const retryableErr = { response: { status: 503, headers: {} } };
    const fn = jest.fn().mockRejectedValue(retryableErr);

    // retries=0 means no retries allowed – should throw immediately
    await expect(withRetry(fn, 0)).rejects.toEqual(retryableErr);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on non-retryable errors', async () => {
    const clientErr = { response: { status: 400 } };
    const fn = jest.fn().mockRejectedValue(clientErr);
    await expect(withRetry(fn, 3)).rejects.toEqual(clientErr);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('normalises OpenAI API error messages', async () => {
    const apiErr = {
      response: {
        status: 400,
        data: { error: { message: 'Invalid model', code: 'model_not_found' } },
      },
    };
    const fn = jest.fn().mockRejectedValue(apiErr);
    await expect(withRetry(fn)).rejects.toMatchObject({
      message: 'Invalid model',
      status: 400,
      code: 'model_not_found',
    });
  });
});
