import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { authService } from '@lib/auth';
import { userService } from '@lib/services';
import type { LoginCredentials, RegisterCredentials } from '@app-types/index';

export const useAuth = () => {
  const { user, isLoading, error, isAuthenticated, setUser, setIsLoading, setError, logout } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(credentials);
        if (response.user) {
          setUser(response.user);
        }
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsLoading, setError]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.register(credentials);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  const verifyOtp = useCallback(
    async (email: string, otp: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.verifyOtp({ email, otp });
        if (response.user) {
          setUser(response.user);
        }
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OTP verification failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsLoading, setError]
  );

  const googleLogin = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.googleLogin(credential);
        if (response.user) {
          setUser(response.user);
        }
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsLoading, setError]
  );

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(message);
      throw err;
    }
  }, [setUser, setError]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    verifyOtp,
    googleLogin,
    logout,
    refreshProfile,
  };
};

export const useUserStats = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await userService.getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};
