import { authApi } from '@/lib/api';
import { LoginRequest, RegisterRequest } from '@personal-website/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: user => {
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: user => {
      if (!user) return;
      queryClient.setQueryData(['user'], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
  });
};
