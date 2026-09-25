'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TrainingSummary, TrainingDetail, TrainingFilters, CreateTrainingRequest } from '@disaster/types';

export function useTrainings(filters?: TrainingFilters) {
  return useQuery({
    queryKey: ['trainings', filters],
    queryFn: async () => {
      const { data } = await api.get('/trainings', { params: filters });
      return data;
    },
  });
}

export function useTraining(id: string) {
  return useQuery({
    queryKey: ['training', id],
    queryFn: async () => {
      const { data } = await api.get(`/trainings/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
}

export function useCreateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateTrainingRequest) => {
      const { data } = await api.post('/trainings', body);
      return data.data || data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trainings'] }),
  });
}

export function useUpdateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: CreateTrainingRequest & { id: string }) => {
      const { data } = await api.put(`/trainings/${id}`, body);
      return data.data || data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['trainings'] });
      qc.invalidateQueries({ queryKey: ['training', vars.id] });
    },
  });
}

export function useSubmitTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/trainings/${id}/submit`);
      return data.data || data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['trainings'] });
      qc.invalidateQueries({ queryKey: ['training', id] });
    },
  });
}

export function useReviewTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action, comments }: { id: string; action: 'approve' | 'reject'; comments?: string }) => {
      const { data } = await api.post(`/trainings/${id}/review`, { action, comments });
      return data.data || data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['trainings'] });
      qc.invalidateQueries({ queryKey: ['training', vars.id] });
    },
  });
}

export function useCompleteTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/trainings/${id}/complete`);
      return data.data || data;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['trainings'] });
      qc.invalidateQueries({ queryKey: ['training', id] });
    },
  });
}

export function useDeleteTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/trainings/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trainings'] }),
  });
}
