import {
  CreateEntry,
  EntryResponse,
  UpdateEntry,
} from '@personal-website/shared';
import { apiClient } from './client';

export const entriesApi = {
  getAll: () => apiClient<EntryResponse[]>('/entries'),

  getBySlug: (slug: string) => apiClient<EntryResponse>(`/entries/${slug}`),

  create: (entry: CreateEntry) => {
    if (entry.type === 'image' && entry.image) {
      const formData = new FormData();
      formData.append('type', entry.type);
      formData.append('title', entry.title);
      formData.append('body', entry.body);
      formData.append('image', entry.image as File);

      return apiClient<EntryResponse>('/entries', {
        method: 'POST',
        body: formData,
      });
    }

    return apiClient<EntryResponse>('/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  update: (slug: string, entry: UpdateEntry) => {
    if (entry.image) {
      const formData = new FormData();

      if (entry.title) formData.append('title', entry.title);
      if (entry.body) formData.append('body', entry.body);
      formData.append('image', entry.image as File);

      return apiClient<EntryResponse>(`/entries/${slug}`, {
        method: 'PUT',
        body: formData,
      });
    }

    return apiClient<EntryResponse>(`/entries/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  },

  delete: async (slug: string) => {
    return apiClient<null>(`/entries/${slug}`, {
      method: 'DELETE',
    });
  },
};
