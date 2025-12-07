import { aboutApi } from '@/lib/api';
import { AboutContent } from '@personal-website/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: () => aboutApi.get(),
  });
};

export const useUpdateAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: AboutContent) => aboutApi.update(content),
    onSuccess: content => {
      queryClient.setQueryData(['about'], content);
    },
  });
};
