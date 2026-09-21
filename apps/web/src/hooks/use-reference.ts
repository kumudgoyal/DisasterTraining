'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { StateRef, DistrictRef, TrainingTypeRef, TrainingThemeRef } from '@disaster/types';

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data } = await api.get('/reference/states');
      return data.data as StateRef[];
    },
    staleTime: Infinity,
  });
}

export function useDistricts(stateId?: number) {
  return useQuery({
    queryKey: ['districts', stateId],
    queryFn: async () => {
      const { data } = await api.get(`/reference/states/${stateId}/districts`);
      return data.data as DistrictRef[];
    },
    enabled: !!stateId,
    staleTime: Infinity,
  });
}

export function useTrainingTypes() {
  return useQuery({
    queryKey: ['training-types'],
    queryFn: async () => {
      const { data } = await api.get('/reference/training-types');
      return data.data as TrainingTypeRef[];
    },
    staleTime: Infinity,
  });
}

export function useTrainingThemes() {
  return useQuery({
    queryKey: ['training-themes'],
    queryFn: async () => {
      const { data } = await api.get('/reference/training-themes');
      return data.data as TrainingThemeRef[];
    },
    staleTime: Infinity,
  });
}
