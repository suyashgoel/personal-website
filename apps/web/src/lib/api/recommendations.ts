import {
  EntryResponse,
  RecommendationsResponse,
} from '@personal-website/shared';
import { apiClient } from './client';

export const recommendationsApi = {
  getByQuery: (
    query: string,
    excludeSlugs: string[] = []
  ): Promise<RecommendationsResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    excludeSlugs.forEach(slug => searchParams.append('excludeSlugs', slug));
    return apiClient<RecommendationsResponse>(
      `/recommendations?${searchParams.toString()}`
    );
  },

  getBySlug: (slug: string): Promise<RecommendationsResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('slug', slug);
    return apiClient<RecommendationsResponse>(
      `/recommendations?${searchParams.toString()}`
    );
  },

  getTopMatch: (query: string): Promise<EntryResponse> =>
    apiClient<EntryResponse>(`/recommendations/top-match/${query}`),
};
