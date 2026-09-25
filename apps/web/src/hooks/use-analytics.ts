'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardStats, TrainingTrend, CategoryDistribution, StateCoverage, DistrictCoverage, ImpactMetrics, AnalyticsFilters } from '@disaster/types';

export function useDashboardStats(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard', { params: filters });
      return data.data || data;
    },
  });
}

export function useTrainingTrends(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['training-trends', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/trends', { params: filters });
      return data.data || data;
    },
  });
}

export function useCategoryDistribution(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['category-distribution', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/categories', { params: filters });
      return data.data || data;
    },
  });
}

export function useStateCoverage(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['state-coverage', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/coverage/states', { params: filters });
      return data.data || data;
    },
  });
}

export function useDistrictCoverage(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['district-coverage', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/coverage/districts', { params: filters });
      return data.data || data;
    },
  });
}

export function useImpactMetrics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['impact-metrics', filters],
    queryFn: async () => {
      const { data } = await api.get('/analytics/impact', { params: filters });
      return data.data || data;
    },
  });
}
