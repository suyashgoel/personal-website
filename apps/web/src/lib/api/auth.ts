import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@personal-website/shared';
import { apiClient } from './client';

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    apiClient<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => apiClient<null>('/auth/logout', { method: 'POST' }),

  getCurrentUser: () => apiClient<UserResponse>('/auth/me'),
};
