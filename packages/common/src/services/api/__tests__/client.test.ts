import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import type { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

// Mock environment variables
const originalEnv = process.env;

// Mock AxiosHeaders
class MockAxiosHeaders {
  private headers: Record<string, string> = {};

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.assign(this.headers, init);
    }
  }

  set(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  get(key: string) {
    return this.headers[key];
  }

  toJSON() {
    return { ...this.headers };
  }
}

// Type for mocked axios instance
type MockedAxiosInstance = {
  interceptors: {
    request: {
      use: jest.Mock;
      eject: jest.Mock;
      clear: jest.Mock;
    };
    response: {
      use: jest.Mock;
      eject: jest.Mock;
      clear: jest.Mock;
    };
  };
  defaults: {
    headers: MockAxiosHeaders;
  };
};

const mockHeaders = new MockAxiosHeaders();
const mockCreate = jest.fn().mockReturnValue({
  interceptors: {
    request: {
      use: jest.fn((fn) => fn),
      eject: jest.fn(),
      clear: jest.fn(),
    },
    response: {
      use: jest.fn((fn) => fn),
      eject: jest.fn(),
      clear: jest.fn(),
    },
  },
  defaults: {
    headers: mockHeaders,
  },
} as MockedAxiosInstance);

jest.doMock('axios', () => ({
  create: mockCreate,
  AxiosHeaders: MockAxiosHeaders,
}));

// Import after mock
import apiClient from '../client';

describe('ApiClient', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_URL: 'http://localhost:5000',
      NEXT_PUBLIC_API_VERSION: 'v1',
      NEXT_PUBLIC_API_TIMEOUT: '30000',
      NEXT_PUBLIC_MAX_RETRIES: '3',
      NEXT_PUBLIC_RETRY_DELAY: '1000',
      NEXT_PUBLIC_AUTH_TOKEN_NAME: 'token',
    };

    // Clear localStorage
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
  });

  describe('Configuration', () => {
    it('should create axios instance with base URL', () => {
      // Create a new instance to test configuration
      new (apiClient.constructor as any)({
        baseURL: 'http://localhost:5000/api/v1',
      });

      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: 'http://localhost:5000/api/v1',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle authentication token in request interceptor', async () => {
      const token = 'test-token';
      window.localStorage.setItem('token', token);

      const instance = new (apiClient.constructor as any)({
        baseURL: 'http://localhost:5000/api/v1',
      });

      const mockConfig = {
        headers: new MockAxiosHeaders(),
      } as unknown as InternalAxiosRequestConfig;

      const axiosInstance = mockCreate.mock.results[0].value as MockedAxiosInstance;
      const requestInterceptor = axiosInstance.interceptors.request.use.mock.calls[0][0] as (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;
      await requestInterceptor(mockConfig);

      expect(mockConfig.headers['Authorization']).toBe(`Bearer ${token}`);
    });
  });
}); 