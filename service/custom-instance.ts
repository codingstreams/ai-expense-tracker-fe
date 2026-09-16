import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from './apiClient';
import { ApiResponse } from '@/types/auth.dto';

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  // Remove trailing slashes and trailing /api since OpenAPI paths already start with /api
  return envUrl.replace(/\/+$/, '').replace(/\/api$/, '');
};

export const customInstance = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const baseUrl = getBaseUrl();
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${baseUrl}${normalizedUrl}`;

  const headers = new Headers(options?.headers || {});

  if (options?.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach auth token if available
  const isAuthRoute = normalizedUrl.includes('/auth/') && normalizedUrl !== '/api/auth/logout';
  if (!isAuthRoute && !headers.has('Authorization')) {
    try {
      const store = useAuthStore.getState();
      const token = store.getToken();
      const tokenType = store.auth?.tokenType || 'Bearer';

      if (token) {
        headers.set('Authorization', `${tokenType} ${token}`);
      }
    } catch {
      // Store may not be accessible in certain environments
    }
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let apiResponse: ApiResponse | undefined;
    try {
      if (errorBody) {
        apiResponse = JSON.parse(errorBody) as ApiResponse;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON error bodies
    }

    const errorMessage =
      apiResponse?.message || errorBody || `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(errorMessage, response.status, apiResponse);
  }

  if (response.status === 204 || response.status === 205) {
    return {
      data: {} as unknown,
      status: response.status,
      headers: response.headers,
    } as T;
  }

  const text = await response.text();
  let data: unknown = null;

  if (text && text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export default customInstance;
