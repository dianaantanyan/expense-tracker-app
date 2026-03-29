'use client';
import { create } from 'zustand/react';
import { authServiceServer } from '../services/auth-service-server';
import { getCookieFromStorage, removeCookie } from '../../core/utils/cookie-client';
import { cookieNames } from '../../core/constants/cookie';
import { coreErrorMessages } from '../../core/constants/api-message';

import { ResponseType } from '../../core/types/api';
import { UserType } from '../types/user';
import { AuthTokenType } from '../types/sign-in';

interface AuthStore {
  user: UserType | null;
  loading: boolean;
  saveUserInfo: (authInfo: UserType) => void;
  logout: () => Promise<void>;
  fetchAndSaveUser: () => Promise<ResponseType<UserType | null>>;
  isUserAuth: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  isUserAuth: () => Boolean(get().user),

  saveUserInfo: (authInfo: UserType) => {
    set({ user: authInfo });
  },

  logout: async () => {
    const { data } = await authServiceServer.signOutUser();
    if (data) {
      removeCookie(cookieNames.USER_KEY);
      set({ user: null });
    }
  },

  fetchAndSaveUser: async (): Promise<ResponseType<UserType | null>> => {
    const tokenData = getCookieFromStorage<AuthTokenType>(cookieNames.USER_KEY);

    if (!tokenData)
      return { data: null, error: coreErrorMessages.WENT_WRONG };

    set({ loading: true });

    const { data, error } = await authServiceServer.refreshToken(tokenData);

    set({ loading: false });

    if (data) set({ user: data });
    else set({ user: null });

    return { data: data ?? null, error };
  },
}));