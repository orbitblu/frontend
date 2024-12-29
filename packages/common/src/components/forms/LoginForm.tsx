import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api/client';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" aria-busy={isLoading}>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-disabled={isLoading}
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}; 