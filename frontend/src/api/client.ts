import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { normalizeError, AppError } from './errors';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers, ...restOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    if (!response.ok) {
      // Central 401 handling
      if (response.status === 401) {
        useAuthStore.getState().logout();
        // Redirect to login preserving path without losing active session store
        const currentPath = window.location.pathname + window.location.search;
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
        }
      }

      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const appError: AppError = normalizeError(
        { status: response.status, data: errorData },
        API_BASE_URL
      );
      throw appError;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (err: unknown) {
    if ((err as AppError).status !== undefined) {
      throw err;
    }
    const normalized = normalizeError(err, API_BASE_URL);
    throw normalized;
  }
}
