import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import type { Mock } from 'jest-mock';
import type { AuthContextType } from '../../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockRouter = {
    replace: jest.fn(),
    asPath: '/protected-page',
  } as unknown as NextRouter;

  const mockAuthContext = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  } as AuthContextType;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useAuth as Mock).mockReturnValue(mockAuthContext);
  });

  it('should show loading state', () => {
    (useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      loading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should redirect unauthenticated users to login', async () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        `/login?returnUrl=${encodeURIComponent('/protected-page')}`
      );
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render content for authenticated users', () => {
    (useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      },
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect users without required role', async () => {
    (useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      },
    });

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
    });

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should render content for users with required role', () => {
    (useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      },
    });

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should handle null user when checking roles', async () => {
    (useAuth as Mock).mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: true,
      user: null,
    });

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
    });

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
}); 