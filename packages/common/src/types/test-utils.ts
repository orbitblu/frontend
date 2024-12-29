import { jest } from '@jest/globals';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  User,
  MockedFunction,
  MockAxiosConfig,
  MockAxiosResponse,
  MockRequestInterceptor,
  MockResponseInterceptor,
  MockSuccessInterceptor,
  MockAxiosInstance,
  MockAxiosMethod,
  MockAxiosMethodWithUrl,
  MockAxiosMethodWithData
} from './test-utils.d';

export type { 
  User,
  MockedFunction,
  MockAxiosConfig,
  MockAxiosResponse,
  MockRequestInterceptor,
  MockResponseInterceptor,
  MockSuccessInterceptor,
  MockAxiosInstance,
  MockAxiosMethod,
  MockAxiosMethodWithUrl,
  MockAxiosMethodWithData
};

export function createMockAxiosMethod<T = any>(): jest.MockedFunction<MockAxiosMethod> {
  const mockFn = jest.fn() as jest.MockedFunction<MockAxiosMethod>;
  mockFn.mockResolvedValue({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders()
    } as MockAxiosConfig
  } as AxiosResponse);
  return mockFn;
}

export function createMockAxiosMethodWithUrl<T = any>(): jest.MockedFunction<MockAxiosMethodWithUrl> {
  const mockFn = jest.fn() as jest.MockedFunction<MockAxiosMethodWithUrl>;
  mockFn.mockResolvedValue({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders()
    } as MockAxiosConfig
  } as AxiosResponse);
  return mockFn;
}

export function createMockAxiosMethodWithData<T = any>(): jest.MockedFunction<MockAxiosMethodWithData> {
  const mockFn = jest.fn() as jest.MockedFunction<MockAxiosMethodWithData>;
  mockFn.mockResolvedValue({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders()
    } as MockAxiosConfig
  } as AxiosResponse);
  return mockFn;
}

export function createMockGetUri(): jest.MockedFunction<(config?: AxiosRequestConfig) => string> {
  return jest.fn(() => '') as jest.MockedFunction<(config?: AxiosRequestConfig) => string>;
}

export function createMockAxiosResponse<T = any>(data: T, status = 200): MockAxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders()
    } as MockAxiosConfig
  };
}

export function createMockRequestInterceptor(): jest.MockedFunction<MockRequestInterceptor> {
  return jest.fn((config) => config) as jest.MockedFunction<MockRequestInterceptor>;
}

export function createMockResponseInterceptor(): jest.MockedFunction<MockResponseInterceptor> {
  return jest.fn((error) => Promise.reject(error)) as jest.MockedFunction<MockResponseInterceptor>;
}

export function createMockSuccessInterceptor(): jest.MockedFunction<MockSuccessInterceptor> {
  return jest.fn((response) => response) as jest.MockedFunction<MockSuccessInterceptor>;
} 