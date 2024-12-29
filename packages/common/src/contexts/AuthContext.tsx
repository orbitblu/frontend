import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      setError(null);
      let token: string | null = null;
      
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        console.error('Error accessing localStorage:', e);
        setError(e instanceof Error ? e.message : 'Error accessing localStorage');
        setLoading(false);
        return;
      }
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.me();
        if (!userData) {
          throw new Error('No user data returned');
        }
        
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        try {
          localStorage.removeItem('token');
        } catch (e) {
          console.error('Error removing token from localStorage:', e);
        }
        setUser(null);
        setIsAuthenticated(false);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ username, password });
      if (!response?.token || !response?.user) {
        throw new Error('Invalid response from server');
      }
      
      // Store token first
      localStorage.setItem('token', response.token);
      // Then update state
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ username, email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // First clear local state and token
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Then call API
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
      // Even if API fails, we want to stay logged out
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      error,
      login, 
      register, 
      logout,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 