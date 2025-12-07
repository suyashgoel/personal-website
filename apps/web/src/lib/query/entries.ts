import { entriesApi } from '@/lib/api';
import { CreateEntry, UpdateEntry } from '@personal-website/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useEntries = () => {
  return useQuery({
    queryKey: ['entries'],
    queryFn: () => entriesApi.getAll(),
  });
};

export const useEntry = (slug: string) => {
  return useQuery({
    queryKey: ['entry', slug],
    queryFn: () => entriesApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: CreateEntry) => entriesApi.create(entry),
    onSuccess: entry => {
      queryClient.setQueryData(['entry', entry.slug], entry);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, entry }: { slug: string; entry: UpdateEntry }) =>
      entriesApi.update(slug, entry),
    onSuccess: entry => {
      queryClient.setQueryData(['entry', entry.slug], entry);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => entriesApi.delete(slug),
    onSuccess: (_, slug) => {
      queryClient.removeQueries({ queryKey: ['entry', slug] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
