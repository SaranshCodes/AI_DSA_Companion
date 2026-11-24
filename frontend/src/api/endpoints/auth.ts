import { apiClient } from '../client';
import { LoginResponse, Me } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
  },

  signup: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
  },

  getMe: async (): Promise<Me> => {
    return apiClient<Me>('/api/auth/me', {
      method: 'GET',
    });
  },
};
