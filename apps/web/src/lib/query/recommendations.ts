import { recommendationsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useRecommendationsByQuery = (query: string) => {
  return useQuery({
    queryKey: ['recommendations', 'query', query],
    queryFn: () => recommendationsApi.getByQuery(query),
    enabled: !!query,
  });
};

export const useRecommendationsBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['recommendations', 'slug', slug],
    queryFn: () => recommendationsApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useTopMatch = (query: string) => {
  return useQuery({
    queryKey: ['recommendations', 'top-match', query],
    queryFn: () => recommendationsApi.getTopMatch(query),
    enabled: !!query,
  });
};
