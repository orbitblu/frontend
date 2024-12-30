/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import type { Mock } from 'jest-mock';
import { ReactElement } from 'react';
import { RenderOptions } from '@testing-library/react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export type MockedFunction<T extends (...args: unknown[]) => unknown> = Mock<ReturnType<T>, Parameters<T>> & {
  (...args: Parameters<T>): ReturnType<T>;
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeDisabled(): R;
      toBeInvalid(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toContainHTML(html: string): R;
      toBeVisible(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveStyle(css: Record<string, unknown>): R;
      toHaveFocus(): R;
      not: Matchers<R>;
    }
  }
}

export type MockAxiosConfig = InternalAxiosRequestConfig & {
  headers: AxiosHeaders;
};

export type MockAxiosResponse<T = unknown> = AxiosResponse<T> & {
  config: MockAxiosConfig;
};

export type MockRequestInterceptor = (config: MockAxiosConfig) => MockAxiosConfig | Promise<MockAxiosConfig>;
export type MockResponseInterceptor = (error: unknown) => unknown;
export type MockSuccessInterceptor = (response: MockAxiosResponse) => MockAxiosResponse | Promise<MockAxiosResponse>;

export type MockAxiosMethod = <T = unknown, R = AxiosResponse<T>>(
  config?: AxiosRequestConfig
) => Promise<R>;

export type MockAxiosMethodWithUrl = <T = unknown, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig
) => Promise<R>;

export type MockAxiosMethodWithData = <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
) => Promise<R>;

export interface MockAxiosInstance extends Omit<AxiosInstance, 'interceptors'> {
  interceptors: {
    request: {
      use: jest.MockedFunction<(interceptor: MockRequestInterceptor) => number>;
    };
    response: {
      use: jest.MockedFunction<(onFulfilled: MockSuccessInterceptor, onRejected: MockResponseInterceptor) => number>;
    };
  };
  defaults: {
    headers: AxiosHeaders;
  };
  request: jest.MockedFunction<MockAxiosMethod>;
  get: jest.MockedFunction<MockAxiosMethodWithUrl>;
  delete: jest.MockedFunction<MockAxiosMethodWithUrl>;
  head: jest.MockedFunction<MockAxiosMethodWithUrl>;
  options: jest.MockedFunction<MockAxiosMethodWithUrl>;
  post: jest.MockedFunction<MockAxiosMethodWithData>;
  put: jest.MockedFunction<MockAxiosMethodWithData>;
  patch: jest.MockedFunction<MockAxiosMethodWithData>;
  postForm: jest.MockedFunction<MockAxiosMethodWithData>;
  putForm: jest.MockedFunction<MockAxiosMethodWithData>;
  patchForm: jest.MockedFunction<MockAxiosMethodWithData>;
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Record<string, unknown>;
  route?: string;
}

export interface WrapperProps {
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}

export interface TestContextProps {
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
): import('@testing-library/react').RenderResult;

export function createTestContext(props: TestContextProps): ReactElement; 