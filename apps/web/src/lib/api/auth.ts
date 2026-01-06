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

  login: (data: LoginRequest): Promise<UserResponse | null> =>
    apiClient<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(error => {
      if (error.statusCode === 401) {
        return null;
      }
      throw error;
    }),

  logout: (): Promise<null> =>
    apiClient<null>('/auth/logout', { method: 'POST' }),

  getCurrentUser: (): Promise<UserResponse> =>
    apiClient<UserResponse>('/auth/me'),
};
