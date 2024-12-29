import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

interface RetryConfig {
  retryCount: number;
  maxRetries: number;
  retryDelay: number;
}

interface ApiErrorResponse {
  message: string;
  status: number;
}

export class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private client: AxiosInstance;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
      maxRetries: config.maxRetries || Number(process.env.NEXT_PUBLIC_MAX_RETRIES) || 3,
      retryDelay: config.retryDelay || Number(process.env.NEXT_PUBLIC_RETRY_DELAY) || 1000,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(new ApiError(error.message));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(new ApiError('Request configuration error'));
        }

        const retryConfig = originalRequest as any;

        // Initialize retry count if not exists
        if (!retryConfig.retryCount) {
          retryConfig.retryCount = 0;
        }

        // Handle specific error cases
        if (error.response) {
          const errorData = error.response.data as ApiErrorResponse;
          switch (error.response.status) {
            case 401:
              // Token expired or invalid
              if (errorData.message === 'Token expired') {
                return this.handleTokenExpiration(originalRequest);
              }
              // Clear auth state on other 401 errors
              localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'token');
              localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME || 'refresh_token');
              window.location.href = '/login';
              throw new ApiError(errorData.message || 'Unauthorized', 401, errorData);
            case 429:
              // Rate limiting - retry with exponential backoff
              if (retryConfig.retryCount < this.config.maxRetries!) {
                retryConfig.retryCount += 1;
                const delay = this.calculateRetryDelay(retryConfig as RetryConfig);
                await this.sleep(delay);
                return this.client(originalRequest);
              }
              throw new ApiError('Too many requests', 429);
            case 400:
              // Validation errors
              throw new ApiError(errorData.message || 'Validation error', 400, errorData);
            case 404:
              // Resource not found
              throw new ApiError('Resource not found', 404);
            case 500:
              // Server error
              throw new ApiError('Internal server error', 500);
            default:
              throw new ApiError(errorData.message || 'Unknown error', error.response.status, errorData);
          }
        } else if (error.request) {
          // Network error
          throw new ApiError('Network error - please check your connection');
        }

        return Promise.reject(new ApiError(error.message));
      }
    );
  }

  private async handleTokenExpiration(originalRequest: InternalAxiosRequestConfig) {
    try {
      const refreshToken = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME || 'refresh_token');
      if (!refreshToken) {
        throw new ApiError('No refresh token available', 401);
      }

      const response = await this.client.post<{ token: string }>('/auth/refresh', { refresh_token: refreshToken });
      const { token } = response.data;

      localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'token', token);
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return this.client(originalRequest);
    } catch (error) {
      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'token');
      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME || 'refresh_token');
      window.location.href = '/login';
      throw new ApiError('Session expired', 401);
    }
  }

  private calculateRetryDelay(config: RetryConfig): number {
    const baseDelay = config.retryDelay;
    const exponentialBackoff = Math.pow(2, config.retryCount - 1);
    const jitter = Math.random() * 1000;
    return baseDelay * exponentialBackoff + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  public async get<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  public async patch<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }
}

// Create and export the API client instance
const apiClient = new ApiClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}`,
});

export default apiClient; 