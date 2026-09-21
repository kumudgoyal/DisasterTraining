import { prisma } from '../config/database';

export interface GeoFilter {
  stateId?: number;
  districtId?: number;
  orgId?: string;
  typeId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface MapMarker {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  typeId: number;
  capacity: number;
}

export class GisService {
  static async getTrainingMarkers(filters: GeoFilter): Promise<MapMarker[]> {
    const where: any = {
      latitude: { not: null },
      longitude: { not: null },
    };

    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.orgId) where.orgId = filters.orgId;
    if (filters.typeId) where.typeId = filters.typeId;
    if (filters.startDate) where.startDate = { gte: new Date(filters.startDate) };
    if (filters.endDate) where.startDate = { ...where.startDate, lte: new Date(filters.endDate) };

    const trainings = await prisma.training.findMany({
      where,
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        status: true,
        typeId: true,
        capacity: true,
      },
    });

    return trainings
      .filter((t: any) => t.latitude && t.longitude)
      .map((t: any) => ({
        id: t.id,
        title: t.title,
        latitude: t.latitude!,
        longitude: t.longitude!,
        status: t.status,
        typeId: t.typeId,
        capacity: t.capacity,
      }));
  }

  static async getHeatmapData(filters: GeoFilter) {
    const where: any = {
      latitude: { not: null },
      longitude: { not: null },
    };

    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.orgId) where.orgId = filters.orgId;

    const trainings = await prisma.training.findMany({
      where,
      select: {
        latitude: true,
        longitude: true,
        _count: { select: { participants: true } },
      },
    });

    return trainings.map((t: any) => ({
      latitude: t.latitude,
      longitude: t.longitude,
      intensity: t._count.participants,
    }));
  }

  static async getCoverage(level: 'state' | 'district', filters: GeoFilter) {
    const byField = level === 'state' ? 'stateId' : 'districtId';
    const where: any = {};
    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;

    const groups = await prisma.training.groupBy({
      by: [byField],
      where,
      _count: { id: true },
    });

    return groups.map((g: any) => ({
      id: g[byField],
      count: g._count.id,
    }));
  }

  static async getNearbyTrainings(lat: number, lng: number, radiusKm: number, filters: GeoFilter) {
    // Simple distance calculation using Haversine approximation
    // 1 degree of latitude ≈ 111km
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

    const where: any = {
      latitude: { gte: lat - latDelta, lte: lat + latDelta },
      longitude: { gte: lng - lngDelta, lte: lng + lngDelta },
    };

    if (filters.status) where.status = filters.status;
    if (filters.typeId) where.typeId = filters.typeId;

    const trainings = await prisma.training.findMany({
      where,
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        status: true,
        capacity: true,
      },
    });

    return trainings;
  }
}
