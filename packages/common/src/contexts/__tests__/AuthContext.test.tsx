jest.mock('../../services/api/auth', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
    isAuthenticated: jest.fn(),
    refreshToken: jest.fn(),
  },
}));

/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { AuthProvider, useAuth, AuthContextType } from '../AuthContext';
import authService from '../../services/api/auth';
import type { UserProfile, AuthResponse, LoginCredentials, RegisterCredentials } from '../../services/api/auth';

// Create mock data
const mockUser: UserProfile = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

const mockAuthResponse: AuthResponse = {
  token: 'test-token',
  refresh_token: 'test-refresh-token',
  user: mockUser
};

// Get the mocked functions
const mockLogin = jest.mocked(authService.login);
const mockRegister = jest.mocked(authService.register);
const mockLogout = jest.mocked(authService.logout);
const mockGetProfile = jest.mocked(authService.getProfile);
const mockIsAuthenticated = jest.mocked(authService.isAuthenticated);
const mockRefreshToken = jest.mocked(authService.refreshToken);

const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading ? 'Loading...' : 'Not Loading'}</div>
      <div data-testid="error">{auth.error || 'No Error'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'Yes' : 'No'}</div>
      {auth.user && <div data-testid="user">{auth.user.name}</div>}
    </div>
  );
};

const renderWithAuth = (onAuth?: (auth: AuthContextType) => void) => {
  const TestAuthComponent = () => {
    const auth = useAuth();
    React.useEffect(() => {
      if (onAuth) {
        onAuth(auth);
      }
    }, [auth]);

    return (
      <div>
        <div data-testid="loading">{auth.loading ? 'Loading...' : 'Not Loading'}</div>
        <div data-testid="error">{auth.error || 'No Error'}</div>
        <div data-testid="authenticated">{auth.isAuthenticated ? 'Yes' : 'No'}</div>
        {auth.user && <div data-testid="user">{auth.user.name}</div>}
      </div>
    );
  };

  return render(
    <AuthProvider>
      <TestAuthComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
    mockLogin.mockImplementation(() => Promise.resolve(mockAuthResponse));
    mockRegister.mockImplementation(() => Promise.resolve(mockAuthResponse));
    mockLogout.mockImplementation(() => Promise.resolve());
    mockGetProfile.mockImplementation(() => Promise.resolve(mockUser));
    mockRefreshToken.mockImplementation(() => Promise.resolve('new-token'));
  });

  it('initializes with no authenticated user', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
    expect(screen.queryByTestId('user')).not.toBeInTheDocument();
  });

  it('initializes with an authenticated user', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetProfile.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.name);
    });
  });

  it('handles successful login', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    mockLogin.mockResolvedValue(mockAuthResponse);

    let authContext: AuthContextType | null = null;
    renderWithAuth((auth) => {
      authContext = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    await act(async () => {
      await authContext!.login(credentials);
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.name);
      expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    });
  });

  it('handles login failure', async () => {
    const credentials = { email: 'test@example.com', password: 'wrong' };
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValue(error);

    let authContext: AuthContextType | null = null;
    renderWithAuth((auth) => {
      authContext = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    await act(async () => {
      try {
        await authContext!.login(credentials);
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      expect(screen.queryByTestId('user')).not.toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const credentials = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    mockRegister.mockResolvedValue(mockAuthResponse);

    let authContext: AuthContextType | null = null;
    renderWithAuth((auth) => {
      authContext = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    await act(async () => {
      await authContext!.register(credentials);
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.name);
      expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    });
  });

  it('handles registration failure', async () => {
    const credentials = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    const error = new Error('Email already exists');
    mockRegister.mockRejectedValue(error);

    let authContext: AuthContextType | null = null;
    renderWithAuth((auth) => {
      authContext = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    await act(async () => {
      try {
        await authContext!.register(credentials);
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
      expect(screen.getByTestId('error')).toHaveTextContent('Email already exists');
      expect(screen.queryByTestId('user')).not.toBeInTheDocument();
    });
  });

  it('handles successful logout', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetProfile.mockResolvedValue(mockUser);

    let authContext: AuthContextType | null = null;
    renderWithAuth((auth) => {
      authContext = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
    });

    await act(async () => {
      await authContext!.logout();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
      expect(screen.queryByTestId('user')).not.toBeInTheDocument();
      expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    });
  });

  it('handles failed initialization', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const error = new Error('Network error');
    mockGetProfile.mockRejectedValue(error);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      expect(screen.queryByTestId('user')).not.toBeInTheDocument();
    });
  });
}); 