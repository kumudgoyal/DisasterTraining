import prisma from '../config/database';
import { AnalyticsFilters } from './analytics.service';

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
  static async getTrainingMarkers(filters: AnalyticsFilters): Promise<MapMarker[]> {
    const conditions = ['t.location IS NOT NULL'];
    const params: any[] = [];

    if (filters.stateId) { params.push(filters.stateId); conditions.push(`t.state_id = $${params.length}`); }
    if (filters.districtId) { params.push(filters.districtId); conditions.push(`t.district_id = $${params.length}`); }
    if (filters.orgId) { params.push(filters.orgId); conditions.push(`t.org_id = $${params.length}::uuid`); }
    if (filters.typeId) { params.push(filters.typeId); conditions.push(`t.type_id = $${params.length}`); }
    if (filters.startDate) { params.push(new Date(filters.startDate)); conditions.push(`t.start_date >= $${params.length}::date`); }
    if (filters.endDate) { params.push(new Date(filters.endDate)); conditions.push(`t.start_date <= $${params.length}::date`); }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT 
        t.id, t.title, ST_Y(t.location::geometry) as latitude, ST_X(t.location::geometry) as longitude, 
        t.status, t.type_id as "typeId", t.capacity
      FROM trainings t
      WHERE ${whereClause}
    `;

    const result: any[] = await prisma.$queryRawUnsafe(query, ...params);
    return result;
  }

  static async getHeatmapData(filters: AnalyticsFilters) {
    const conditions = ['t.location IS NOT NULL'];
    const params: any[] = [];

    if (filters.stateId) { params.push(filters.stateId); conditions.push(`t.state_id = $${params.length}`); }
    if (filters.districtId) { params.push(filters.districtId); conditions.push(`t.district_id = $${params.length}`); }
    if (filters.orgId) { params.push(filters.orgId); conditions.push(`t.org_id = $${params.length}::uuid`); }
    
    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT 
        ST_Y(t.location::geometry) as latitude, 
        ST_X(t.location::geometry) as longitude, 
        (SELECT COUNT(*) FROM training_participants tp WHERE tp.training_id = t.id)::int as intensity
      FROM trainings t
      WHERE ${whereClause}
    `;

    return prisma.$queryRawUnsafe(query, ...params);
  }

  static async getCoverage(level: 'state' | 'district', filters: AnalyticsFilters) {
    const byField = level === 'state' ? 'stateId' : 'districtId';
    const where: any = {};
    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.districtId) where.districtId = filters.districtId;

    const groups = await prisma.training.groupBy({
      by: [byField],
      where,
      _count: { id: true }
    });

    return groups.map(g => ({
      id: g[byField],
      count: g._count.id
    }));
  }

  static async getNearbyTrainings(lat: number, lng: number, radiusKm: number, filters: AnalyticsFilters) {
    const radiusMeters = radiusKm * 1000;
    const conditions = [];
    const params: any[] = [lng, lat, radiusMeters];

    conditions.push(`ST_DWithin(t.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)`);

    if (filters.status) { params.push(filters.status); conditions.push(`t.status = $${params.length}`); }
    if (filters.typeId) { params.push(filters.typeId); conditions.push(`t.type_id = $${params.length}`); }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT 
        t.id, t.title, ST_Y(t.location::geometry) as latitude, ST_X(t.location::geometry) as longitude, 
        t.status, t.capacity
      FROM trainings t
      WHERE ${whereClause}
    `;

    return prisma.$queryRawUnsafe(query, ...params);
  }
}
