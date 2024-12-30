/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../_app';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';

// Mock the AuthContext module
jest.mock('@orbitblu/common/contexts/AuthContext', () => {
  const mockUseAuth = jest.fn();
  const AuthProvider = ({ children }) => {
    const React = require('react');
    return React.createElement(React.Fragment, null, children);
  };
  return {
    useAuth: mockUseAuth,
    AuthProvider,
  };
});

// Mock the ProtectedRoute component
jest.mock('@orbitblu/common/components/ProtectedRoute', () => {
  const React = require('react');
  return {
    ProtectedRoute: ({ children, requiredRole }) => {
      const { useAuth } = require('@orbitblu/common/contexts/AuthContext');
      const { useRouter } = require('next/router');
      const auth = useAuth();
      const router = useRouter();

      React.useEffect(() => {
        if (!auth.isAuthenticated || (auth.user && auth.user.role !== requiredRole)) {
          router.push('/auth/login');
        }
      }, [auth.isAuthenticated, auth.user, router, requiredRole]);

      if (!auth.isAuthenticated || (auth.user && auth.user.role !== requiredRole)) {
        return null;
      }

      return React.createElement(React.Fragment, null, children);
    },
  };
});

// Mock the Layout component
jest.mock('@orbitblu/common/components/Layout', () => {
  const React = require('react');
  return {
    Layout: ({ children }) => React.createElement('div', { 'data-testid': 'layout' }, children),
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseAuth = jest.requireMock('@orbitblu/common/contexts/AuthContext').useAuth;
const mockUseRouter = useRouter as jest.Mock;

describe('Customer App', () => {
  const mockRouter: Partial<NextRouter> = {
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    basePath: '',
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    route: '',
    locale: '',
    locales: [],
    defaultLocale: '',
    domainLocales: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('renders authenticated customer content', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'customer',
        email: 'customer@example.com',
        role: 'customer',
      },
      loading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const TestComponent = () => <div data-testid="customer-content">Customer Content</div>;
    
    render(
      <App 
        Component={TestComponent} 
        pageProps={{}} 
        router={mockRouter as AppProps['router']} 
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('customer-content')).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('redirects admin users to admin portal', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '2',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      },
      loading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const TestComponent = () => <div>Customer Content</div>;
    
    render(
      <App 
        Component={TestComponent} 
        pageProps={{}} 
        router={mockRouter as AppProps['router']} 
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/admin');
  });

  it('redirects unauthenticated users to login', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const TestComponent = () => <div>Customer Content</div>;
    
    render(
      <App 
        Component={TestComponent} 
        pageProps={{}} 
        router={mockRouter as AppProps['router']} 
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });
}); 