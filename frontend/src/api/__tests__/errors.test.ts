import { describe, it, expect } from 'vitest';
import { normalizeError } from '../errors';

describe('normalizeError', () => {
  it('formats network connection errors with base URL', () => {
    const err = new Error('Failed to fetch');
    const appErr = normalizeError(err, 'http://127.0.0.1:8000');
    expect(appErr.message).toBe("Can't reach the API at http://127.0.0.1:8000");
    expect(appErr.isNetworkError).toBe(true);
  });

  it('formats FastAPI 422 validation array details', () => {
    const raw = {
      status: 422,
      data: {
        detail: [
          { loc: ['body', 'time_taken_mins'], msg: 'Field required' },
          { loc: ['body', 'confidence'], msg: 'Value must be between 1 and 5' },
        ],
      },
    };
    const appErr = normalizeError(raw);
    expect(appErr.status).toBe(422);
    expect(appErr.message).toBe('Field required; Value must be between 1 and 5');
  });

  it('extracts string detail from 500 error', () => {
    const raw = {
      status: 500,
      data: {
        detail: 'Gemini rate limit exceeded',
      },
    };
    const appErr = normalizeError(raw);
    expect(appErr.status).toBe(500);
    expect(appErr.message).toBe('Gemini rate limit exceeded');
  });
});
