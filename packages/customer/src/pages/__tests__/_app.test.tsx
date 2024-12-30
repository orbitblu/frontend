/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../_app';
import { useAuth } from '@orbitblu/common/contexts/AuthContext';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';

// Mock the AuthContext module
jest.mock('@orbitblu/common/contexts/AuthContext', () => {
  const mockUseAuth = jest.fn();
  const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return {
    useAuth: mockUseAuth,
    AuthProvider,
  };
});

// Mock the ProtectedRoute component
jest.mock('@orbitblu/common/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children, requiredRole }: { children: React.ReactNode; requiredRole: string }) => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!isAuthenticated || (user && user.role !== requiredRole)) {
        router.push('/auth/login');
      }
    }, [isAuthenticated, user, router, requiredRole]);

    if (!isAuthenticated || (user && user.role !== requiredRole)) {
      return null;
    }

    return <>{children}</>;
  },
}));

// Mock the Layout component
jest.mock('@orbitblu/common/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
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

    // Wait for any effects to complete
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

    // Wait for any effects to complete
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

    // Wait for any effects to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });
}); 