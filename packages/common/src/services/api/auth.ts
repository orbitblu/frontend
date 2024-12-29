import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RefreshTokenResponse {
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private tokenName = process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'token';
  private refreshTokenName = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME || 'refresh_token';

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response.data.token, response.data.refresh_token);
    return response.data;
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    this.setTokens(response.data.token, response.data.refresh_token);
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  public async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(this.refreshTokenName);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    localStorage.setItem(this.tokenName, response.data.token);
    return response.data.token;
  }

  public async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/profile');
    return response.data;
  }

  public isAuthenticated(): boolean {
    try {
      return !!localStorage.getItem(this.tokenName);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  }

  private setTokens(token: string, refreshToken: string): void {
    try {
      localStorage.setItem(this.tokenName, token);
      localStorage.setItem(this.refreshTokenName, refreshToken);
    } catch (error) {
      console.error('Error setting tokens in localStorage:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  private clearTokens(): void {
    try {
      localStorage.removeItem(this.tokenName);
      localStorage.removeItem(this.refreshTokenName);
    } catch (error) {
      console.error('Error clearing tokens from localStorage:', error);
    }
  }
}

export const authService = new AuthService();
export default authService; 