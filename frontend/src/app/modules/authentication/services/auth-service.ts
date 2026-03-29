import { AuthTokenType, SignInRequest } from '../types/sign-in';
import { ResponseType } from '../../core/types/api';
import { getErrorMessage } from '../../core/utils/api';
import { RegisterRequest } from '../validation/sign-up.schema';
import { UserType } from '../types/user';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
  login: async (data: SignInRequest): Promise<ResponseType<{ access_token: string; refresh_token: string }>> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { data: json, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  register: async (data: RegisterRequest): Promise<ResponseType<UserType>> => {
    try {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { data: json, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  refreshToken: async (tokenData: AuthTokenType): Promise<ResponseType<UserType>> => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData),
      });
      const json = await res.json();
      return { data: json, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  logout: async (): Promise<ResponseType<null>> => {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`);
      await res.json();
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },
};