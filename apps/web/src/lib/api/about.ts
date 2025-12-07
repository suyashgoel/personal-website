import { AboutContent } from '@personal-website/shared';
import { apiClient } from './client';

export const aboutApi = {
  get: (): Promise<AboutContent> => apiClient<AboutContent>('/about'),

  update: (content: AboutContent): Promise<AboutContent> =>
    apiClient<AboutContent>('/about', {
      method: 'PUT',
      body: JSON.stringify(content),
    }),
};
