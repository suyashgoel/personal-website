import { AboutContent } from '@personal-website/shared';
import { apiClient } from './client';

export const aboutApi = {
  get: () => apiClient<AboutContent>('/about'),

  update: (content: AboutContent) =>
    apiClient<AboutContent>('/about', {
      method: 'PUT',
      body: JSON.stringify(content),
    }),
};
