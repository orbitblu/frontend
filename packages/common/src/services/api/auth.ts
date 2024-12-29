import { getApiClient } from './client';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export interface TokenResponse {
  token: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await getApiClient().post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await getApiClient().post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    await getApiClient().post('/auth/logout');
  },

  refreshToken: async () => {
    const response = await getApiClient().post<TokenResponse>('/auth/refresh');
    return response.data;
  },

  me: async () => {
    const response = await getApiClient().get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
}; 