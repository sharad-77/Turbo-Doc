import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authClient } from './auth-client';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 600000, // 10 minutes for file operations
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get session from better-auth
      const session = await authClient.getSession();

      if (session?.data?.session?.token) {
        config.headers.Authorization = `Bearer ${session.data.session.token}`;
      }
    } catch (error) {
      // If session fetch fails, continue without token
      console.warn('Failed to get session token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh session
        const session = await authClient.getSession();

        if (session?.data?.session?.token) {
          originalRequest.headers.Authorization = `Bearer ${session.data.session.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as { error?: string; message?: string })?.error ||
      (error.response?.data as { error?: string; message?: string })?.message ||
      error.message ||
      'An unexpected error occurred';

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;

