import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { useAuth } from '../../../contexts/AuthContext';
import type { AuthContextType } from '../../../contexts/AuthContext';
import { ApiError } from '../../../services/api/client';

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn() as jest.MockedFunction<(credentials: { email: string; password: string; }) => Promise<void>>;
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ login: mockLogin });
  });

  it('renders login form with all required fields', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'testuser',
        password: 'password123'
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new ApiError(errorMessage, 401));

    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('disables form during submission', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveTextContent(/logging in/i);
    });
  });

  it('validates required fields', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/username/i)).toBeInvalid();
    expect(screen.getByLabelText(/password/i)).toBeInvalid();
  });
}); 