/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../../services/api/auth';
import type { User, MockedFunction } from '../../types/test-utils';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import React from 'react';

// Mock auth API
jest.mock('../../services/api/auth');

interface AuthResponse {
  token: string;
  user: User;
}

type LoginFn = (username: string, password: string) => Promise<AuthResponse>;
type MeFn = () => Promise<User>;
type LogoutFn = () => Promise<void>;
type RegisterFn = (userData: User) => Promise<AuthResponse>;

const mockAuthApi = {
  login: jest.fn() as MockedFunction<LoginFn>,
  me: jest.fn() as MockedFunction<MeFn>,
  logout: jest.fn() as MockedFunction<LogoutFn>,
  register: jest.fn() as MockedFunction<RegisterFn>,
};

// Override the mocked module
(authApi as unknown as typeof mockAuthApi) = mockAuthApi;

// Test component that observes auth state
const TestComponent = () => {
  const { loading, error } = useAuth();
  return (
    <div>
      <div data-testid="loading-state">{loading ? 'Loading' : 'Loaded'}</div>
      {error && <div data-testid="error-state">{error}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockAuthApi.me.mockReset();
    mockAuthApi.login.mockReset();
    mockAuthApi.logout.mockReset();
    mockAuthApi.register.mockReset();
    
    // Clear localStorage
    window.localStorage.clear();
  });

  it('should handle localStorage errors', async () => {
    // Setup localStorage error
    const mockGetItem = jest.fn().mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    Object.defineProperty(window.localStorage, 'getItem', {
      value: mockGetItem
    });

    // Mock the API call to reject
    mockAuthApi.me.mockRejectedValue(new Error('No user data returned'));

    // Render the component
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent('localStorage error');
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded');
    });

    // Verify the calls were made
    expect(mockGetItem).toHaveBeenCalledWith('token');
  });

  it('should handle invalid token', async () => {
    // Setup invalid token case
    const mockGetItem = jest.fn().mockReturnValue('invalid-token');
    Object.defineProperty(window.localStorage, 'getItem', {
      value: mockGetItem
    });
    mockAuthApi.me.mockRejectedValue(new Error('Invalid token'));

    // Render the component
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent('Invalid token');
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loaded');
    });

    // Verify cleanup was called
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
}); 