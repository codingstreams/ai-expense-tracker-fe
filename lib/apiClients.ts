// lib/apiClient.ts
import { BASE_URL } from '@/config';
import { AuthResponseDto } from '@/types/auth.dto';

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
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed: {auth:AuthResponseDto} = JSON.parse(authStorage);
        const token = parsed?.auth?.accessToken;
        const tokenType = parsed?.auth?.tokenType;
        // const expireAt = parsed?.auth?.expireAt;


        if (token) {
          headers.set('Authorization', `${tokenType} ${token}`);
        }
      } catch (e) {
        console.error('Failed to parse auth storage', e);
      }
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

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}