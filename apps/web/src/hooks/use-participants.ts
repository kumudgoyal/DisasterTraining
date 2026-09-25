import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useParticipants(trainingId: string) {
  return useQuery({
    queryKey: ['participants', trainingId],
    queryFn: async () => {
      const { data } = await api.get(`/participants/training/${trainingId}`);
      return data.data; // Assuming paginated response format
    },
    enabled: !!trainingId,
  });
}

export function useCreateParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ trainingId, data }: { trainingId: string, data: any }) => {
      const res = await api.post(`/participants/training/${trainingId}`, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['participants', vars.trainingId] });
    },
  });
}

export function useAttendance(trainingId: string) {
  return useQuery({
    queryKey: ['attendance', trainingId],
    queryFn: async () => {
      const { data } = await api.get(`/attendance/training/${trainingId}`);
      return data.data; 
    },
    enabled: !!trainingId,
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ trainingId, participantId, status }: { trainingId: string, participantId: string, status: string }) => {
      const res = await api.post(`/attendance/training/${trainingId}`, {
        records: [{ participantId, status }]
      });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['attendance', vars.trainingId] });
    },
  });
}

export function useAssessments(trainingId: string) {
  return useQuery({
    queryKey: ['assessments', trainingId],
    queryFn: async () => {
      const { data } = await api.get(`/assessments/training/${trainingId}/summary`);
      return data.data;
    },
    enabled: !!trainingId,
  });
}
