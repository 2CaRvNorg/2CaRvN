import api from './api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  OtpVerification,
} from '@app-types/index';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.debug('[Auth] register', credentials.email);
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', credentials);
      return data;
    } catch (err: any) {
      console.debug('[Auth] register failed', err);
      const errors: { field: string; message: string }[] = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        throw new Error(errors.map((e) => `${e.field}: ${e.message}`).join(' | '));
      }
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.debug('[Auth] login', credentials.email);
    try {
      const { data: responseBody } = await api.post<{ success: boolean; data: { user: any } }>('/auth/login', credentials);
      const { user } = responseBody.data;
      // ✅ Store user info in sessionStorage (cleared on browser close)
      // ✅ Access token is automatically stored in httpOnly cookie by backend
      sessionStorage.setItem('user', JSON.stringify(user));
      return { success: true, message: 'Login successful', user };
    } catch (err: any) {
      console.debug('[Auth] login failed', err);
      const errors: { field: string; message: string }[] = err.response?.data?.errors;
      const responseData = err.response?.data?.data;
      const message = err.response?.data?.message || 'Login failed';
      if (errors && errors.length > 0) {
        const error = new Error(errors.map((e) => e.message).join(' | ')) as AuthResponse & Error;
        error.attemptsRemaining = responseData?.attemptsRemaining;
        error.error = responseData?.error;
        throw error;
      }

      const error = new Error(message) as AuthResponse & Error;
      error.attemptsRemaining = responseData?.attemptsRemaining;
      error.error = responseData?.error;
      throw error;
    }
  },

  async verifyOtp(verification: OtpVerification): Promise<AuthResponse> {
    console.debug('[Auth] verifyOtp', verification.email);
    const { data } = await api.post<AuthResponse>('/auth/login/verify-otp', verification);
    if (data.user) {
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    console.log('[Auth Service] googleLogin called with credential length:', credential.length);
    try {
      console.log('[Auth Service] Making API request to /auth/google');
      const response = await api.post('/auth/google', { credential });
      console.log('[Auth Service] Raw API response:', response);
      console.log('[Auth Service] Response data:', response.data);
      console.log('[Auth Service] Response data.data:', response.data?.data);
      console.log('[Auth Service] Response data.data.user:', response.data?.data?.user);

      const { data: responseData } = response;
      const user = responseData?.data?.user || responseData?.user;

      console.log('[Auth Service] Extracted user:', user);

      if (user) {
        console.log('[Auth Service] Storing user in sessionStorage');
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      return {
        success: responseData.success,
        message: responseData.message,
        user: user
      };
    } catch (err: any) {
      console.error('[Auth Service] googleLogin failed:', err);
      console.error('[Auth Service] Error response data:', err.response?.data);
      console.error('[Auth Service] Error status:', err.response?.status);
      const errors: { field: string; message: string }[] = err.response?.data?.errors;
      const message = err.response?.data?.message || 'Google login failed';
      if (errors && errors.length > 0) {
        throw new Error(errors.map((e) => e.message).join(' | '));
      }
      throw new Error(message);
    }
  },

  async logout(): Promise<void> {
    console.debug('[Auth] logout');
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.debug('[Auth] logout error', err);
    } finally {
      sessionStorage.removeItem('user');
    }
  },

  async refresh(): Promise<AuthResponse> {
    console.debug('[Auth] refresh token');
    const { data } = await api.post<AuthResponse>('/auth/refresh');
    if (data.user) {
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  getStoredUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
