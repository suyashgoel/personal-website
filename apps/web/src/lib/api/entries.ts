import {
  CreateEntry,
  EntryResponse,
  UpdateEntry,
} from '@personal-website/shared';
import { apiClient } from './client';

export const entriesApi = {
  getAll: (): Promise<EntryResponse[]> =>
    apiClient<EntryResponse[]>('/entries'),

  getBySlug: (slug: string): Promise<EntryResponse> =>
    apiClient<EntryResponse>(`/entries/${slug}`),

  create: (entry: CreateEntry): Promise<EntryResponse> => {
    const formData = new FormData();
    formData.append('type', entry.type);
    formData.append('title', entry.title);
    formData.append('body', entry.body);
    formData.append('image', entry.image as File);

    return apiClient<EntryResponse>('/entries', {
      method: 'POST',
      body: formData,
    });
  },

  update: (slug: string, entry: UpdateEntry): Promise<EntryResponse> => {
    return apiClient<EntryResponse>(`/entries/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  },

  delete: async (slug: string): Promise<null> => {
    return apiClient<null>(`/entries/${slug}`, {
      method: 'DELETE',
    });
  },
};
