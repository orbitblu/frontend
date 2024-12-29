import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

let client: AxiosInstance | null = null;

export function resetClient(): void {
  client = null;
}

export function createApiClient(): AxiosInstance {
  if (client) {
    return client;
  }

  client = axios.create({
    baseURL: '/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    
    config.headers.set('Content-Type', 'application/json');
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          try {
            localStorage.removeItem('token');
          } catch (e) {
            console.error('Error removing token from localStorage:', e);
          }
          window.location.href = '/auth/login';
        }
        throw new ApiError(
          error.response.data?.message || 'An error occurred',
          error.response.status
        );
      }
      throw new ApiError(error.message || 'Network error');
    }
  );

  return client;
}

export function getApiClient(): AxiosInstance {
  return createApiClient();
} 