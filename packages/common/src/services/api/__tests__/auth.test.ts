import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AxiosResponse } from 'axios';
import apiClient from '../client';
import authService, { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  UserProfile,
  RefreshTokenResponse 
} from '../auth';

// Mock the API client
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Helper to create mock responses
function createMockResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  };
}

describe('Auth Service', () => {
  const mockStorage: Record<string, string> = {};
  let mockPost: jest.MockedFunction<typeof apiClient.post>;
  let mockGet: jest.MockedFunction<typeof apiClient.get>;

  beforeEach(() => {
    // Clear mocks and storage
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);

    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn((key: string) => mockStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      }),
      key: jest.fn((index: number) => Object.keys(mockStorage)[index] || null),
      length: 0
    };

    // Reset environment variables
    process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME = 'token';
    process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME = 'refresh_token';

    // Type the mock functions
    mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
    mockGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
  });

  describe('Login', () => {
    it('should store tokens and return user data on successful login', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse: AuthResponse = {
        token: 'test-token',
        refresh_token: 'test-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer'
        }
      };

      mockPost.mockResolvedValueOnce(createMockResponse(mockResponse));

      const response = await authService.login(credentials);

      expect(mockPost).toHaveBeenCalledWith('/auth/login', credentials);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('refresh_token', mockResponse.refresh_token);
      expect(response).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      mockPost.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Register', () => {
    it('should store tokens and return user data on successful registration', async () => {
      const credentials: RegisterCredentials = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        confirmPassword: 'password123'
      };

      const mockResponse: AuthResponse = {
        token: 'test-token',
        refresh_token: 'test-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer'
        }
      };

      mockPost.mockResolvedValueOnce(createMockResponse(mockResponse));

      const response = await authService.register(credentials);

      expect(mockPost).toHaveBeenCalledWith('/auth/register', credentials);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('refresh_token', mockResponse.refresh_token);
      expect(response).toEqual(mockResponse);
    });

    it('should handle registration errors', async () => {
      const credentials: RegisterCredentials = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        confirmPassword: 'password123'
      };

      mockPost.mockRejectedValueOnce(new Error('Email already exists'));

      await expect(authService.register(credentials)).rejects.toThrow('Email already exists');
    });
  });

  describe('Logout', () => {
    it('should clear tokens on logout', async () => {
      mockPost.mockResolvedValueOnce(createMockResponse({}));

      await authService.logout();

      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should clear tokens even if logout request fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      try {
        await authService.logout();
      } catch (error) {
        // Ignore the error as we expect it to be thrown
      }

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token successfully', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const newToken = 'new-token';
      mockStorage.refresh_token = oldRefreshToken;

      mockPost.mockResolvedValueOnce(createMockResponse<RefreshTokenResponse>({ token: newToken }));

      const token = await authService.refreshToken();

      expect(mockPost).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: oldRefreshToken
      });
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', newToken);
      expect(token).toBe(newToken);
    });

    it('should throw error when no refresh token is available', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
    });
  });

  describe('Profile', () => {
    it('should fetch user profile', async () => {
      const mockProfile: UserProfile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer'
      };

      mockGet.mockResolvedValueOnce(createMockResponse(mockProfile));

      const profile = await authService.getProfile();

      expect(mockGet).toHaveBeenCalledWith('/auth/profile');
      expect(profile).toEqual(mockProfile);
    });
  });

  describe('Authentication Status', () => {
    it('should return true when token exists', () => {
      mockStorage.token = 'test-token';
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should handle localStorage errors', () => {
      const mockError = new Error('localStorage not available');
      (localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(authService.isAuthenticated()).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error accessing localStorage:', mockError);
      consoleErrorSpy.mockRestore();
    });
  });
}); 