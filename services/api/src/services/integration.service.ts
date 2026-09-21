import prisma from '../config/database';
import crypto from 'crypto';
import * as argon2 from 'argon2';
import { notFound, badRequest } from '../utils/errors';
import { createPaginatedResponse } from '../utils/pagination';

export class IntegrationService {
  static async listSources() {
    return prisma.integrationSource.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createSource(data: any) {
    return prisma.integrationSource.create({ data });
  }

  static async updateSource(id: string, data: any) {
    const existing = await prisma.integrationSource.findUnique({ where: { id } });
    if (!existing) throw notFound('Integration source not found');
    return prisma.integrationSource.update({ where: { id }, data });
  }

  static async triggerSync(sourceId: string) {
    const source = await prisma.integrationSource.findUnique({ where: { id: sourceId } });
    if (!source) throw notFound('Integration source not found');

    if (!source.apiUrl) {
      return { status: 'CONFIGURATION_REQUIRED', message: 'API URL and credentials must be configured' };
    }

    const sync = await prisma.integrationSync.create({
      data: {
        sourceId,
        status: 'IN_PROGRESS'
      }
    });

    try {
      // Mock HTTP call
      const res = await fetch(source.apiUrl);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      await prisma.integrationSync.update({
        where: { id: sync.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          recordsProcessed: 100
        }
      });
    } catch (e: any) {
      await prisma.integrationSync.update({
        where: { id: sync.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorLog: e.message
        }
      });
    }

    return sync;
  }

  static async getSyncLogs(sourceId: string, pagination: any) {
    const where = { sourceId };
    const total = await prisma.integrationSync.count({ where });
    const data = await prisma.integrationSync.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' }
    });
    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async createApiKey(userId: string, name: string, scopes: any) {
    const plainKey = crypto.randomBytes(32).toString('hex');
    const apiKeyHash = await argon2.hash(plainKey);

    const client = await prisma.apiClient.create({
      data: {
        name,
        apiKeyHash,
        scopes
      }
    });

    return {
      id: client.id,
      name: client.name,
      apiKey: plainKey
    };
  }

  static async listApiKeys() {
    const keys = await prisma.apiClient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return keys.map(k => ({
      id: k.id,
      name: k.name,
      isActive: k.isActive,
      scopes: k.scopes,
      createdAt: k.createdAt
    }));
  }

  static async revokeApiKey(id: string) {
    return prisma.apiClient.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
