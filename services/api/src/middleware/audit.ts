import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Middleware factory that logs an audit entry after route handler execution.
 * Records: user, action, entity, entityId, IP address, user agent.
 */
export function auditAction(action: string, module: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Store original json method to intercept response
    const originalJson = res.json.bind(res);
    
    res.json = function (body: Record<string, unknown>) {
      // Only audit successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const recordId = req.params.id || (body?.data as Record<string, unknown>)?.id as string || undefined;
        
        // Fire and forget — don't block the response
        prisma.auditLog.create({
          data: {
            userId: req.user?.userId || null,
            role: req.user?.role || null,
            action: action as 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
            module,
            recordId: recordId ? String(recordId) : null,
            ipAddress: (req.ip || req.socket.remoteAddress || null) as string | null,
            newValue: req.method !== 'GET' && req.method !== 'DELETE' ? req.body : undefined,
          },
        }).catch((err: Error) => {
          logger.error('Failed to create audit log', { error: err.message, action, module });
        });
      }
      
      return originalJson(body);
    };

    next();
  };
}

/**
 * Directly create an audit log entry (for use in services).
 */
export async function createAuditLog(params: {
  userId?: string;
  role?: string;
  action: string;
  module: string;
  recordId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        role: params.role || null,
        action: params.action as 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
        module: params.module,
        recordId: params.recordId || null,
        oldValue: params.oldValue || undefined,
        newValue: params.newValue || undefined,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (err) {
    logger.error('Failed to create audit log', { error: (err as Error).message, ...params });
  }
}
