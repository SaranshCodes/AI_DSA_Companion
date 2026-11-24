export interface AppError {
  status: number;
  message: string;
  isNetworkError?: boolean;
}

export function normalizeError(err: unknown, baseUrl = 'http://127.0.0.1:8000'): AppError {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return { status: 499, message: 'Request was cancelled' };
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return {
        status: 0,
        message: `Can't reach the API at ${baseUrl}`,
        isNetworkError: true,
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyErr = err as any;
  const status = typeof anyErr?.status === 'number' ? anyErr.status : 500;
  let message = 'An unexpected error occurred';

  if (anyErr?.data) {
    const detail = anyErr.data.detail;
    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      // FastAPI 422 validation details: [{ loc: [...], msg: "...", type: "..." }]
      message = detail
        .map((d: { msg?: string; loc?: string[] }) => d.msg || 'Validation error')
        .join('; ');
    } else if (anyErr.data.message) {
      message = anyErr.data.message;
    }
  } else if (typeof anyErr?.message === 'string') {
    message = anyErr.message;
  }

  return { status, message };
}
