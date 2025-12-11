import { recommendationsApi } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useRecommendationsByQuery = (
  query: string,
  excludeSlugs: string[]
) => {
  return useQuery({
    queryKey: ['recommendations', 'query', query, excludeSlugs],
    queryFn: () => recommendationsApi.getByQuery(query, excludeSlugs),
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

export const useTopMatch = () => {
  return useMutation({
    mutationFn: (query: string) => recommendationsApi.getTopMatch(query),
  });
};
