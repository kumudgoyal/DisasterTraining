import prisma from '../config/database';
import { emitToUser } from '../utils/socket';
import { createPaginatedResponse } from '../utils/pagination';

export class NotificationService {
  static async create(userId: string, title: string, message: string, type: any, refId?: string, refType?: string) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        refId,
        refType
      }
    });

    emitToUser(userId, 'notification:new', notification);
    return notification;
  }

  static async getUserNotifications(userId: string, filters: any, pagination: any) {
    const where: any = { userId };
    if (filters?.isRead !== undefined) where.isRead = filters.isRead;

    const total = await prisma.notification.count({ where });
    const data = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.limit
    });

    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  static async delete(id: string, userId: string) {
    return prisma.notification.deleteMany({
      where: { id, userId }
    });
  }

  static async createForRole(role: any, title: string, message: string, type: any, refId?: string, refType?: string) {
    const users = await prisma.user.findMany({ where: { role, isActive: true } });
    for (const user of users) {
      await this.create(user.id, title, message, type, refId, refType);
    }
  }
}
