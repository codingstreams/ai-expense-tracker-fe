import { BASE_URL } from '@/config';
import { useAuthStore } from '@/store/useAuthStore';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const isAuthRoute = endpoint.includes('/auth/');
  if (!isAuthRoute) {
    try {
      const store = useAuthStore.getState();
      const token = store.getToken();

      const tokenType = store.auth?.tokenType || 'Bearer';

      if (token) {
        headers.set('Authorization', `${tokenType} ${token}`);
      } else {
        console.warn('No valid auth token found for secure endpoint. Endpoint: ' + endpoint);
      }
    } catch (e) {
      console.error('Failed to append authorization header', e);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `API Error: ${response.statusText}`);
  }

  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn('Error parsing response as JSON:', err);
    return text as unknown as T;
  }
}