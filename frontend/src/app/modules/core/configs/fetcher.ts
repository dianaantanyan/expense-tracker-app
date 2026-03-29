import { cookieNames } from '../constants/cookie';
import { getCookieFromStorage } from '../utils/cookie-client';
import { AuthTokenType } from '../../authentication/types/sign-in';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ClientOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  data?: unknown;
};

export async function clientInstance<T = unknown>(path: string, options: ClientOptions = {}): Promise<T> {
  const auth = getCookieFromStorage<AuthTokenType>(cookieNames.USER_KEY);

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(auth?.access_token ? { Authorization: `Bearer ${auth.access_token}` } : {}),
    },
    body: options.data ? JSON.stringify(options.data) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData?.message ?? message;
    } catch {
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
