import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Header } from '../Header';
import { useAuth } from '../../../contexts/AuthContext';
import type { AuthContextType } from '../../../contexts/AuthContext';

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      logout: mockLogout,
    });
  });

  it('renders with default title', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Blu AI')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(<Header logo={<img src="/logo.png" alt="Logo" />} />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders navigation when provided', () => {
    render(<Header navigation={<div><a href="/">Home</a></div>} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<Header actions={<button>Custom Action</button>} />);
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' },
      loading: false,
      error: null,
      logout: mockLogout,
    });

    render(<Header />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('hides logout button when not authenticated', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      logout: mockLogout,
    });

    render(<Header />);
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' },
      loading: false,
      error: null,
      logout: mockLogout,
    });

    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
}); 