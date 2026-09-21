'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { NotificationItem, NotificationFilters } from '@disaster/types';

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      const { data } = await api.get('/notifications', { params: filters });
      return data;
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/unread-count');
      return data.data as number;
    },
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}
