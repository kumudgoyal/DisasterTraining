'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { OrganizationSummary, OrganizationDetail, OrganizationFilters, CreateOrganizationRequest } from '@disaster/types';

export function useOrganizations(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: ['organizations', filters],
    queryFn: async () => {
      const { data } = await api.get('/organizations', { params: filters });
      return data;
    },
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${id}`);
      return data.data as OrganizationDetail;
    },
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateOrganizationRequest) => {
      const { data } = await api.post('/organizations', body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}
