import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
import { useAuth } from '../../../contexts/AuthContext';
import type { AuthContextType } from '../../../contexts/AuthContext';
import { ApiError } from '../../../services/api/client';

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('RegisterForm', () => {
  const mockRegister = jest.fn() as jest.MockedFunction<(username: string, email: string, password: string) => Promise<void>>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: false,
    });
  });

  it('renders registration form with all fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<RegisterForm />);

    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm your password/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'short');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'short');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password456');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<RegisterForm />);

    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await userEvent.type(screen.getByLabelText(/username/i), validData.username);
    await userEvent.type(screen.getByLabelText(/email/i), validData.email);
    await userEvent.type(screen.getByLabelText(/^password$/i), validData.password);
    await userEvent.type(screen.getByLabelText(/confirm password/i), validData.password);
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        validData.username,
        validData.email,
        validData.password
      );
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Username already exists';
    mockRegister.mockRejectedValueOnce(new ApiError(errorMessage, 409));

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears field error when user starts typing', async () => {
    render(<RegisterForm />);

    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/username/i), 'a');

    await waitFor(() => {
      expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
    });
  });
}); 