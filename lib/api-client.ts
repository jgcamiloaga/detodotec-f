/**
 * API Client for DeTodoTec
 * A lightweight wrapper around fetch for microservices communication.
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

import { useAuthStore } from "@/features/auth/store/authStore";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

if (!GATEWAY_URL) {
  throw new Error("Missing NEXT_PUBLIC_GATEWAY_URL environment variable");
}

async function request<T>(
  baseUrl: string,
  endpoint: string,
  method: HttpMethod = 'GET',
  options: RequestOptions = {}
): Promise<T> {
  const { params, data, headers, ...rest } = options;

  // Build URL with query params
  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  // Get current access token
  const state = useAuthStore.getState();
  const token = state.accessToken;

  const isFormData = data instanceof FormData;

  const config: RequestInit = {
    method,
    headers: {
      ...(!isFormData && data && { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    let response = await fetch(url.toString(), config);

    // If 401 Unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      let shouldRetryWithoutToken = false;

      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${GATEWAY_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: refreshToken,
          });

          if (refreshRes.ok) {
            const tokens = await refreshRes.json();
            useAuthStore.getState().updateTokens(tokens.accessToken, tokens.refreshToken);
            
            // Retry original request with new token
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${tokens.accessToken}`
            };
            response = await fetch(url.toString(), config);
          } else {
            // Refresh failed, logout
            useAuthStore.getState().logout();
            shouldRetryWithoutToken = true;
          }
        } catch (refreshErr) {
          useAuthStore.getState().logout();
          shouldRetryWithoutToken = true;
        }
      } else {
        // No refresh token, logout
        useAuthStore.getState().logout();
        shouldRetryWithoutToken = true;
      }

      // If token refresh failed, try one last time without the token.
      // This allows public endpoints to succeed even if the user's token just expired.
      if (shouldRetryWithoutToken) {
        const newHeaders = { ...config.headers } as Record<string, string>;
        delete newHeaders['Authorization'];
        config.headers = newHeaders;
        response = await fetch(url.toString(), config);
      }
    }

    if (!response.ok) {
      let errorData;
      const text = await response.text();
      try {
        errorData = text ? JSON.parse(text) : {};
      } catch (e) {
        errorData = text;
      }
      throw new ApiError(
        `API Request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown network error',
      500
    );
  }
}

// Service-specific clients
export const catalogApi = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'GET', options),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'POST', { ...options, data }),
};

export const orderApi = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'GET', options),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'POST', { ...options, data }),
};

export const authApi = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'GET', options),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    request<T>(GATEWAY_URL, endpoint, 'POST', { ...options, data }),
};
