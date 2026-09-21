import { prisma } from '../config/database';
import { createPaginatedResponse } from '../utils/pagination';

export class AlertService {
  static async create(data: any) {
    return prisma.alert.create({ data });
  }

  static async list(filters: any, pagination: any) {
    const where: any = {};
    if (filters.severity) where.severity = filters.severity;
    if (filters.status) where.status = filters.status;

    const total = await prisma.alert.count({ where });
    const data = await prisma.alert.findMany({
      where,
      include: {
        training: { select: { title: true } },
        district: { select: { name: true } },
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    });

    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async resolve(id: string, userId: string) {
    return prisma.alert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedBy: userId,
        resolvedAt: new Date()
      }
    });
  }

  static async getSummary() {
    const severityCount = await prisma.alert.groupBy({
      by: ['severity'],
      where: { status: 'OPEN' },
      _count: true
    });

    const statusCount = await prisma.alert.groupBy({
      by: ['status'],
      _count: true
    });

    return {
      bySeverity: severityCount.map(s => ({ severity: s.severity, count: s._count })),
      byStatus: statusCount.map(s => ({ status: s.status, count: s._count }))
    };
  }

  static async checkAndCreateAlerts() {
    const now = new Date();
    
    // 1. Pending approvals
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const pendingTrainings = await prisma.training.findMany({
      where: { status: 'SUBMITTED', submittedAt: { lt: threeDaysAgo } }
    });

    for (const t of pendingTrainings) {
      const exists = await prisma.alert.findFirst({
        where: { trainingId: t.id, message: { contains: 'Pending approval' }, status: 'OPEN' }
      });
      if (!exists) {
        await prisma.alert.create({
          data: {
            ruleId: 1, // Assume ruleId 1 is generic system rule
            severity: 'MEDIUM',
            message: 'Pending approval for >3 days',
            trainingId: t.id
          }
        });
      }
    }

    // 2. Upcoming trainings
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const upcoming = await prisma.training.findMany({
      where: { startDate: { lte: in7Days, gte: now }, status: 'APPROVED' }
    });

    for (const t of upcoming) {
      const exists = await prisma.alert.findFirst({
        where: { trainingId: t.id, message: { contains: 'starts in less than 7 days' }, status: 'OPEN' }
      });
      if (!exists) {
        await prisma.alert.create({
          data: {
            ruleId: 1,
            severity: 'LOW',
            message: 'Training starts in less than 7 days',
            trainingId: t.id
          }
        });
      }
    }
  }
}
