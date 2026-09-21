'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { UserDetail, UserFilters, CreateUserRequest } from '@disaster/types';

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const { data } = await api.get('/users', { params: filters });
      return data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data.data as UserDetail;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateUserRequest) => {
      const { data } = await api.post('/users', body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
