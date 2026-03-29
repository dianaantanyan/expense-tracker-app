import { getErrorMessage } from './api';

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message };
    }

    return { data: json, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}