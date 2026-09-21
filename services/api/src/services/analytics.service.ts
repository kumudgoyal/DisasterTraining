import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  stateId?: number;
  districtId?: number;
  orgId?: string;
  typeId?: number;
  themeId?: number;
}

function buildWhereClause(filters: AnalyticsFilters) {
  const where: any = {};
  if (filters.stateId) where.stateId = filters.stateId;
  if (filters.districtId) where.districtId = filters.districtId;
  if (filters.orgId) where.orgId = filters.orgId;
  if (filters.typeId) where.typeId = filters.typeId;
  if (filters.themeId) where.themeId = filters.themeId;
  
  if (filters.startDate || filters.endDate) {
    where.startDate = {};
    if (filters.startDate) where.startDate.gte = new Date(filters.startDate);
    if (filters.endDate) where.startDate.lte = new Date(filters.endDate);
  }
  return where;
}

export class AnalyticsService {
  static async getDashboardStats(filters: AnalyticsFilters) {
    const where = buildWhereClause(filters);

    const totalTrainings = await prisma.training.count({ where });
    const completedTrainings = await prisma.training.count({ where: { ...where, status: 'COMPLETED' } });
    const upcomingTrainings = await prisma.training.count({ 
      where: { ...where, startDate: { gt: new Date() }, status: { in: ['APPROVED', 'SCHEDULED'] } } 
    });
    const inProgressTrainings = await prisma.training.count({ where: { ...where, status: 'IN_PROGRESS' } });

    // participants count
    const totalParticipantsRaw = await prisma.trainingParticipant.count({
      where: { training: where }
    });

    const activeOrgs = await prisma.training.findMany({
      where,
      select: { orgId: true },
      distinct: ['orgId']
    });

    const pendingApprovals = await prisma.training.count({ where: { ...where, status: 'SUBMITTED' } });

    const districtsCovered = await prisma.training.findMany({
      where,
      select: { districtId: true },
      distinct: ['districtId']
    });

    // avg attendance
    const attendanceRecords = await prisma.attendance.groupBy({
      by: ['status'],
      where: { training: where },
      _count: true
    });
    const totalAttendance = attendanceRecords.reduce((acc, curr) => acc + curr._count, 0);
    const presentAttendance = attendanceRecords.find(r => r.status === 'PRESENT')?._count || 0;
    const averageAttendance = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    return {
      totalTrainings,
      completedTrainings,
      upcomingTrainings,
      inProgressTrainings,
      totalParticipants: totalParticipantsRaw,
      activeOrganizations: activeOrgs.length,
      pendingApprovals,
      districtsCovered: districtsCovered.length,
      averageAttendance
    };
  }

  static async getTrainingTrends(filters: AnalyticsFilters) {
    const conditions = [];
    const params: any[] = [];
    
    if (filters.stateId) { params.push(filters.stateId); conditions.push(`state_id = $${params.length}`); }
    if (filters.districtId) { params.push(filters.districtId); conditions.push(`district_id = $${params.length}`); }
    if (filters.orgId) { params.push(filters.orgId); conditions.push(`org_id = $${params.length}::uuid`); }
    if (filters.typeId) { params.push(filters.typeId); conditions.push(`type_id = $${params.length}`); }
    if (filters.themeId) { params.push(filters.themeId); conditions.push(`theme_id = $${params.length}`); }
    if (filters.startDate) { params.push(new Date(filters.startDate)); conditions.push(`start_date >= $${params.length}::date`); }
    if (filters.endDate) { params.push(new Date(filters.endDate)); conditions.push(`start_date <= $${params.length}::date`); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT DATE_TRUNC('month', start_date) as month, COUNT(*)::int as count, SUM(capacity)::int as participants 
      FROM trainings 
      ${whereClause} 
      GROUP BY month 
      ORDER BY month
    `;

    const result: any[] = await prisma.$queryRawUnsafe(query, ...params);

    return result.map(r => ({
      month: r.month,
      count: r.count,
      participants: r.participants || 0
    }));
  }

  static async getCategoryDistribution(filters: AnalyticsFilters) {
    const where = buildWhereClause(filters);
    const groups = await prisma.training.groupBy({
      by: ['themeId'],
      where,
      _count: { id: true }
    });

    const themes = await prisma.trainingTheme.findMany();
    const themeMap = new Map(themes.map(t => [t.id, t.name]));

    return groups.map(g => ({
      name: themeMap.get(g.themeId) || 'Unknown',
      count: g._count.id
    }));
  }

  static async getStateCoverage(filters: AnalyticsFilters) {
    const states = await prisma.state.findMany();
    const where = buildWhereClause(filters);

    const result = await Promise.all(states.map(async state => {
      const stateWhere = { ...where, stateId: state.id };
      const trainingsCount = await prisma.training.count({ where: stateWhere });
      const distParts = await prisma.trainingParticipant.findMany({
        where: { training: stateWhere },
        select: { participantId: true },
        distinct: ['participantId']
      });
      const distDistricts = await prisma.training.findMany({
        where: stateWhere,
        select: { districtId: true },
        distinct: ['districtId']
      });
      return {
        name: state.name,
        trainings: trainingsCount,
        participants: distParts.length,
        districts: distDistricts.length
      };
    }));
    return result;
  }

  static async getDistrictCoverage(filters: AnalyticsFilters) {
    const districts = await prisma.district.findMany({ include: { state: true } });
    const where = buildWhereClause(filters);

    const result = await Promise.all(districts.map(async dist => {
      const distWhere = { ...where, districtId: dist.id };
      const trainingsCount = await prisma.training.count({ where: distWhere });
      const distParts = await prisma.trainingParticipant.findMany({
        where: { training: distWhere },
        select: { participantId: true },
        distinct: ['participantId']
      });
      return {
        name: dist.name,
        stateName: dist.state.name,
        trainings: trainingsCount,
        participants: distParts.length
      };
    }));
    return result;
  }

  static async getImpactMetrics(filters: AnalyticsFilters) {
    const where = buildWhereClause(filters);
    const impacts = await prisma.impactAssessment.findMany({
      where: { training: where }
    });

    if (impacts.length === 0) {
      return {
        averageImprovement: 0,
        averagePreScore: 0,
        averagePostScore: 0,
        totalAssessed: 0,
        certificatesIssued: 0,
        averageRating: 0
      };
    }

    const totalAssessed = impacts.reduce((acc, curr) => acc + curr.participantsAssessed, 0);
    const avgImp = impacts.reduce((acc, curr) => acc + curr.avgOverallImprovement, 0) / impacts.length;

    const certCount = await prisma.certificate.count({ where: { training: where } });
    const feedback = await prisma.feedback.aggregate({
      where: { training: where },
      _avg: { overallRating: true }
    });

    return {
      averageImprovement: avgImp,
      averagePreScore: 0, // Would need to join pre assessments to get exact avg
      averagePostScore: 0,
      totalAssessed,
      certificatesIssued: certCount,
      averageRating: feedback._avg.overallRating || 0
    };
  }
}
