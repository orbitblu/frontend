import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { authApi } from '../auth';
import { getApiClient } from '../client';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

jest.mock('../client', () => ({
  getApiClient: jest.fn(),
}));

interface MockResponse extends AxiosResponse {
  data: {
    token?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
}

const mockPost = jest.fn().mockImplementation(() => Promise.resolve({} as MockResponse));
const mockGet = jest.fn().mockImplementation(() => Promise.resolve({} as MockResponse));

const mockClient = {
  post: mockPost,
  get: mockGet,
} as unknown as AxiosInstance;

describe('Auth API', () => {
  const mockResponse: MockResponse = {
    data: {
      token: 'test-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {} as RawAxiosRequestHeaders,
    config: {} as InternalAxiosRequestConfig,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getApiClient as Mock).mockReturnValue(mockClient);
    mockPost.mockImplementation(() => Promise.resolve(mockResponse));
    mockGet.mockImplementation(() => Promise.resolve(mockResponse));
  });

  describe('register', () => {
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const result = await authApi.register(registerData);
      expect(mockPost).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('login', () => {
    const loginData = {
      username: 'testuser',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const result = await authApi.login(loginData);
      expect(mockPost).toHaveBeenCalledWith('/auth/login', loginData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      const emptyResponse: MockResponse = {
        ...mockResponse,
        data: {},
      };
      mockPost.mockImplementation(() => Promise.resolve(emptyResponse));
      await authApi.logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const result = await authApi.refreshToken();
      expect(mockPost).toHaveBeenCalledWith('/auth/refresh');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('me', () => {
    it('should fetch current user successfully', async () => {
      const result = await authApi.me();
      expect(mockGet).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 