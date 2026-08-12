import api from './api';
import { AuthResponse, LoginCredentials, SignupData, User } from '../types';

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>('/auth/profile', data);
    return response.data.user;
  },
};
