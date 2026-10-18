import { API_BASE_URL, ERROR_MESSAGES } from '@/constants';
import { logger } from '@/lib/logger';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { authClient } from './auth-client';
import { getFingerprint } from './fingerprint';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalError?: boolean;
    skipGlobalLoader?: boolean;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await authClient.getSession();

      if (session?.data?.session?.token) {
        config.headers.Authorization = `Bearer ${session.data.session.token}`;
      }

      const fingerprint = await getFingerprint();
      config.headers['x-fingerprint'] = fingerprint;
    } catch (error) {
      console.warn('Failed to get session token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 token refresh retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await authClient.getSession();

        if (session?.data?.session?.token) {
          originalRequest.headers.Authorization = `Bearer ${session.data.session.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // Extract backend error message with priority
    const backendData = error.response?.data as Record<string, unknown> | string | undefined;
    let backendMessage: string | undefined;

    if (typeof backendData === 'string' && backendData.trim()) {
      backendMessage = backendData.trim();
    } else if (backendData && typeof backendData === 'object') {
      if (typeof backendData.message === 'string' && backendData.message.trim()) {
        backendMessage = backendData.message.trim();
      } else if (typeof backendData.error === 'string' && backendData.error.trim()) {
        backendMessage = backendData.error.trim();
      } else if (Array.isArray(backendData.errors) && backendData.errors.length > 0) {
        backendMessage = backendData.errors
          .map((e: unknown) => {
            if (typeof e === 'string') return e;
            if (e && typeof e === 'object' && 'message' in e) {
              return String((e as { message: unknown }).message);
            }
            return JSON.stringify(e);
          })
          .join(', ');
      } else if (typeof backendData.detail === 'string' && backendData.detail.trim()) {
        backendMessage = backendData.detail.trim();
      }
    }

    // Detect limit error (403 daily limit)
    let isLimitError = false;
    if (error.response?.status === 403) {
      const checkText = (backendMessage || '').toLowerCase();
      if (checkText.includes('daily') && checkText.includes('limit')) {
        isLimitError = true;
      }
    }

    // Determine final error message: Give priority to backend response message!
    let finalErrorMessage: string;
    if (backendMessage) {
      finalErrorMessage = backendMessage;
    } else {
      // Custom backend status fallback error messages when backend returns nothing
      if (isLimitError) {
        finalErrorMessage = ERROR_MESSAGES.DAILY_LIMIT;
      } else if (error.response?.status === 429) {
        finalErrorMessage = ERROR_MESSAGES.RATE_LIMIT;
      } else if (error.response && error.response.status >= 500) {
        finalErrorMessage = ERROR_MESSAGES.SERVER_ERROR;
      } else if (error.response?.status === 404) {
        finalErrorMessage = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response?.status === 403) {
        finalErrorMessage = ERROR_MESSAGES.FORBIDDEN;
      } else if (error.response?.status === 401) {
        finalErrorMessage = ERROR_MESSAGES.UNAUTHORIZED;
      } else if (!error.response && error.code === 'ECONNABORTED') {
        finalErrorMessage = ERROR_MESSAGES.TIMEOUT;
      } else if (!error.response) {
        finalErrorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      } else {
        finalErrorMessage = error.message || ERROR_MESSAGES.DEFAULT;
      }
    }

    if (!isLimitError) {
      logger.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: finalErrorMessage,
        backendMessage,
        data: error.response?.data,
      });
    }

    // Display global toast unless ignored by request config
    if (!error.config?.skipGlobalError) {
      toast.error(finalErrorMessage);
    }

    return Promise.reject({
      message: finalErrorMessage,
      status: error.response?.status,
      data: error.response?.data,
      isLimitError,
    });
  }
);

export default apiClient;
