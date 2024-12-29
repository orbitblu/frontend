import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { getApiClient, ApiError, resetClient } from '../client';
import type { 
  MockAxiosConfig, 
  MockAxiosResponse, 
  MockRequestInterceptor,
  MockResponseInterceptor,
  MockSuccessInterceptor,
  MockAxiosInstance,
  MockAxiosMethod,
  MockAxiosMethodWithUrl,
  MockAxiosMethodWithData,
  MockedFunction
} from '../../../types/test-utils.d';

// Mock axios and AxiosHeaders
jest.mock('axios', () => {
  const mockAxiosHeaders = jest.fn().mockImplementation(function(this: any) {
    const headers: Record<string, string> = {};
    this.set = function(key: string, value: string) {
      headers[key] = value;
      this[key] = value;
      return this;
    };
    this.get = function(key: string) {
      return headers[key];
    };
    return this;
  });

  // Create a mock instance factory
  const createMockInstance = () => ({
    getUri: jest.fn(() => ''),
    request: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    postForm: jest.fn(),
    putForm: jest.fn(),
    patchForm: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    defaults: {
      headers: new mockAxiosHeaders(),
    },
  });

  return {
    create: jest.fn((config: { baseURL: string, headers: any }) => {
      // Ensure headers is an AxiosHeaders instance
      if (!(config.headers instanceof mockAxiosHeaders)) {
        config.headers = new mockAxiosHeaders(config.headers);
      }
      return createMockInstance();
    }),
    AxiosHeaders: mockAxiosHeaders
  };
});

describe('API Client', () => {
  const mockStorage: Record<string, string> = {};
  let mockRequestUse: MockedFunction<(interceptor: MockRequestInterceptor) => number>;
  let mockResponseUse: MockedFunction<(onFulfilled: MockSuccessInterceptor, onRejected: MockResponseInterceptor) => number>;

  function createHeaders(init?: Record<string, string>): AxiosHeaders {
    const headers = new AxiosHeaders();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    return headers;
  }

  function createMockAxiosMethod(): MockedFunction<MockAxiosMethod> {
    const mockFn = jest.fn() as MockedFunction<MockAxiosMethod>;
    mockFn.mockResolvedValue({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: createHeaders(),
      config: {
        headers: createHeaders()
      } as MockAxiosConfig
    } as MockAxiosResponse);
    return mockFn;
  }

  function createMockAxiosMethodWithUrl(): MockedFunction<MockAxiosMethodWithUrl> {
    const mockFn = jest.fn() as MockedFunction<MockAxiosMethodWithUrl>;
    mockFn.mockResolvedValue({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: createHeaders(),
      config: {
        headers: createHeaders()
      } as MockAxiosConfig
    } as MockAxiosResponse);
    return mockFn;
  }

  function createMockAxiosMethodWithData(): MockedFunction<MockAxiosMethodWithData> {
    const mockFn = jest.fn() as MockedFunction<MockAxiosMethodWithData>;
    mockFn.mockResolvedValue({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: createHeaders(),
      config: {
        headers: createHeaders()
      } as MockAxiosConfig
    } as MockAxiosResponse);
    return mockFn;
  }

  function createMockGetUri(): MockedFunction<(config?: AxiosRequestConfig) => string> {
    return jest.fn(() => '');
  }

  function createMockAxiosResponse<T = any>(data: T, status = 200): MockAxiosResponse<T> {
    return {
      data,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: createHeaders(),
      config: {
        headers: createHeaders()
      } as MockAxiosConfig
    };
  }

  beforeEach(() => {
    // Clear mocks and storage
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockStorage[key]),
        setItem: jest.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockStorage[key];
        }),
      },
      writable: true,
    });

    // Create mock functions with proper types
    const requestUseMock = jest.fn().mockImplementation((interceptor: unknown) => {
      const config: MockAxiosConfig = {
        headers: createHeaders()
      } as MockAxiosConfig;
      
      try {
        if (typeof interceptor === 'function') {
          return interceptor(config);
        }
      } catch (error) {
        console.error('Error in request interceptor:', error);
      }
      return 1;
    });
    mockRequestUse = requestUseMock as MockedFunction<(interceptor: MockRequestInterceptor) => number>;

    const responseUseMock = jest.fn().mockImplementation((onFulfilled: unknown, onRejected: unknown) => {
      return 1;
    });
    mockResponseUse = responseUseMock as MockedFunction<(onFulfilled: MockSuccessInterceptor, onRejected: MockResponseInterceptor) => number>;

    // Mock axios instance
    const mockAxiosInstance: MockAxiosInstance = {
      getUri: createMockGetUri(),
      request: createMockAxiosMethod(),
      get: createMockAxiosMethodWithUrl(),
      delete: createMockAxiosMethodWithUrl(),
      head: createMockAxiosMethodWithUrl(),
      options: createMockAxiosMethodWithUrl(),
      post: createMockAxiosMethodWithData(),
      put: createMockAxiosMethodWithData(),
      patch: createMockAxiosMethodWithData(),
      postForm: createMockAxiosMethodWithData(),
      putForm: createMockAxiosMethodWithData(),
      patchForm: createMockAxiosMethodWithData(),
      interceptors: {
        request: {
          use: mockRequestUse,
        },
        response: {
          use: mockResponseUse,
        },
      },
      defaults: {
        headers: createHeaders(),
      },
    };

    (axios.create as Mock).mockReturnValue(mockAxiosInstance);

    // Reset the client before each test
    resetClient();
  });

  it('should create axios instance with base URL', () => {
    const client = getApiClient();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should add token to request headers when available', () => {
    const token = 'test-token';
    mockStorage.token = token;

    // Initialize the client to set up interceptors
    const client = getApiClient();
    
    // Get the request interceptor function that was registered
    const interceptorFn = mockRequestUse.mock.calls[0]?.[0];
    expect(interceptorFn).toBeDefined();
    
    // Create a test config
    const config: MockAxiosConfig = {
      headers: createHeaders()
    } as MockAxiosConfig;

    // Call the interceptor function
    const result = (interceptorFn as MockRequestInterceptor)(config);
    if (result instanceof Promise) {
      throw new Error('Expected synchronous result from interceptor');
    }
    expect(result.headers['Authorization']).toBe(`Bearer ${token}`);
  });

  it('should handle 401 responses by clearing token and redirecting', () => {
    // Initialize the client to set up interceptors
    const client = getApiClient();
    const error = {
      response: {
        status: 401,
      },
    };

    // Get the error handler function that was registered
    const [, errorHandlerFn] = mockResponseUse.mock.calls[0] ?? [];
    expect(errorHandlerFn).toBeDefined();
    
    // Call the error handler function
    expect(() => (errorHandlerFn as MockResponseInterceptor)(error)).toThrow(ApiError);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle success responses', () => {
    // Initialize the client to set up interceptors
    const client = getApiClient();
    const response = createMockAxiosResponse({ data: 'test' });
    
    // Get the success handler function that was registered
    const [successHandlerFn] = mockResponseUse.mock.calls[0] ?? [];
    expect(successHandlerFn).toBeDefined();
    
    // Call the success handler function
    const result = (successHandlerFn as MockSuccessInterceptor)(response);
    expect(result).toBe(response);
  });

  it('should handle error responses', () => {
    // Initialize the client to set up interceptors
    const client = getApiClient();
    const error = {
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      },
    };

    // Get the error handler function that was registered
    const [, errorHandlerFn] = mockResponseUse.mock.calls[0] ?? [];
    expect(errorHandlerFn).toBeDefined();
    
    // Call the error handler function
    expect(() => (errorHandlerFn as MockResponseInterceptor)(error)).toThrow(ApiError);
  });
}); 