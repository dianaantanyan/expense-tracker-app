'use client';
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { SignUpRequest } from '../types/sign-up';
import { authServiceServer } from '../services/auth-service-server';
import { SignInRequest } from '../types/sign-in';

export function useAuth() {
  const { user, loading, fetchAndSaveUser, saveUserInfo, logout } = useAuthStore();

  useEffect(() => {
    if (!user) void fetchAndSaveUser();
  }, [fetchAndSaveUser, user]);

  const login = useCallback(async (data: SignInRequest) => {
    const { data: tokenData, error } = await authServiceServer.signInUser(data);
    if (error) throw new Error(error);


    document.cookie = `USER_KEY=${tokenData?.access_token}; path=/;`;
    await fetchAndSaveUser();
  }, [fetchAndSaveUser]);


  const signup = useCallback(async (data: SignUpRequest) => {
    const { error } = await authServiceServer.registerUser(data);
    if (error) throw new Error(error);
  }, []);


  const logoutUser = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user,
    loading,
    login,
    signup,
    logout: logoutUser,
    isAuthenticated: Boolean(user),
  };
}