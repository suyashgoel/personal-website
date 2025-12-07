import {
  EntryResponse,
  RecommendationsResponse,
} from '@personal-website/shared';
import { apiClient } from './client';

export const recommendationsApi = {
  getByQuery: (query: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    return apiClient<RecommendationsResponse>(
      `/recommendations?${searchParams.toString()}`
    );
  },

  getBySlug: (slug: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append('slug', slug);
    return apiClient<RecommendationsResponse>(
      `/recommendations?${searchParams.toString()}`
    );
  },

  getTopMatch: (query: string) =>
    apiClient<EntryResponse>(`/recommendations/top-match/${query}`),
};
