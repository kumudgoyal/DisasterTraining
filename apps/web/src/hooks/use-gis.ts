'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { MapMarker, HeatmapPoint, GeoFilter, NearbyQuery } from '@disaster/types';

export function useTrainingMarkers(filters?: GeoFilter) {
  return useQuery({
    queryKey: ['map-markers', filters],
    queryFn: async () => {
      const { data } = await api.get('/gis/trainings', { params: filters });
      return data.data as MapMarker[];
    },
  });
}

export function useHeatmapData(filters?: GeoFilter) {
  return useQuery({
    queryKey: ['heatmap', filters],
    queryFn: async () => {
      const { data } = await api.get('/gis/heatmap', { params: filters });
      return data.data as HeatmapPoint[];
    },
  });
}

export function useGisCoverage(level: 'state' | 'district', filters?: GeoFilter) {
  return useQuery({
    queryKey: ['gis-coverage', level, filters],
    queryFn: async () => {
      const { data } = await api.get('/gis/coverage', { params: { level, ...filters } });
      return data.data;
    },
  });
}

export function useNearbyTrainings(params?: NearbyQuery & GeoFilter) {
  return useQuery({
    queryKey: ['nearby-trainings', params],
    queryFn: async () => {
      const { data } = await api.get('/gis/nearby', { params });
      return data.data as MapMarker[];
    },
    enabled: !!(params?.latitude && params?.longitude),
  });
}
