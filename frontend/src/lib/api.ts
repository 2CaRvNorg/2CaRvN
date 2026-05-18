import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ErrorResponse } from '@app-types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  // Do not set a global Content-Type so FormData requests can set their own boundary
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return [
    '/auth/login',
    '/auth/register',
    '/auth/google',
    '/auth/refresh',
    '/auth/login/verify-otp',
  ].some((endpoint) => url.includes(endpoint));
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ Access token is sent automatically via httpOnly cookie with withCredentials: true
    // No need to manually add Authorization header
    console.debug('[API Request]', config.method, config.url);
    return config;
  },
  (error) => {
    console.debug('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.debug('[API Response]', response.config.method, response.config.url, response.status);
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as any;
    const status = error.response?.status;
    const url = originalRequest?.url;

    console.debug('[API Response Error]', status, url, originalRequest?._retry);

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(url)
    ) {
      originalRequest._retry = true;
      console.debug('[API Refresh Retry] Attempting token refresh for', url);

      try {
        await api.post('/auth/refresh');

        // ✅ Access token is automatically set in httpOnly cookie by backend
        // No need to manually store it - browser handles it via cookies
        console.debug('[API Refresh Success] Retrying original request', url);
        return api(originalRequest);
      } catch (refreshError) {
        console.debug('[API Refresh Failed] Logging out user and redirecting to login', refreshError);
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
