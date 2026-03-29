import { getErrorMessage } from '../../core/utils/api';
import { ResponseType } from '../../core/types/api';
import { AuthTokenType, SignInRequest } from '../types/sign-in';

import { UserType } from '../types/user';
import { SignUpRequest } from '../types/sign-up';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authServiceServer = {
    signInUser: async (data: SignInRequest): Promise<ResponseType<AuthTokenType>> => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            return { data: null, error: json.message ?? 'Login failed' };
          } catch {
            return { data: null, error: `Server error: ${res.status} ${res.statusText}` };
          }
        }
  
        const jsonData = await res.json();
        return { data: jsonData as AuthTokenType, error: null };
      } catch (error) {
        return { data: null, error: getErrorMessage(error) };
      }
    },
  
    registerUser: async (data: SignUpRequest): Promise<ResponseType<UserType>> => {
      try {
        const res = await fetch(`${API_BASE}/user/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            return { data: null, error: json.message ?? 'Registration failed' };
          } catch {
            return { data: null, error: `Server error: ${res.status} ${res.statusText}` };
          }
        }
  
        const jsonData = await res.json();
        return { data: jsonData as UserType, error: null };
      } catch (error) {
        return { data: null, error: getErrorMessage(error) };
      }
    },
  
    signOutUser: async (): Promise<ResponseType<null>> => {
      try {
        const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  
        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            return { data: null, error: json.message ?? 'Logout failed' };
          } catch {
            return { data: null, error: `Server error: ${res.status} ${res.statusText}` };
          }
        }
  
        return { data: null, error: null };
      } catch (error) {
        return { data: null, error: getErrorMessage(error) };
      }
    },
  
    refreshToken: async (authToken: AuthTokenType): Promise<ResponseType<UserType>> => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authToken),
        });
  
        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            return { data: null, error: json.message ?? 'Token refresh failed' };
          } catch {
            return { data: null, error: `Server error: ${res.status} ${res.statusText}` };
          }
        }
  
        const jsonData = await res.json();
        return { data: jsonData as UserType, error: null };
      } catch (error) {
        return { data: null, error: getErrorMessage(error) };
      }
    },
  };