import prisma from '../config/database';
import { createPaginatedResponse } from '../utils/pagination';

export class AuditService {
  static async list(filters: any, pagination: any) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.module) where.module = filters.module;
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const total = await prisma.auditLog.count({ where });
    const data = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } }
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    });

    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async getModules() {
    const modules = await prisma.auditLog.findMany({
      select: { module: true },
      distinct: ['module']
    });
    return modules.map(m => m.module).filter(Boolean);
  }
}
