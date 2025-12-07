import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@personal-website/shared';
import { apiClient } from './client';

export const authApi = {
  register: (data: RegisterRequest): Promise<UserResponse> =>
    apiClient<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest): Promise<UserResponse> =>
    apiClient<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<null> =>
    apiClient<null>('/auth/logout', { method: 'POST' }),

  getCurrentUser: (): Promise<UserResponse> =>
    apiClient<UserResponse>('/auth/me'),
};
