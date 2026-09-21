import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development'
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ]
      : [
          { level: 'error', emit: 'stdout' },
        ],
  });

if (env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: { query: string; duration: number }) => {
    if (e.duration > 100) {
      logger.debug(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Connect to the database.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    process.exit(1);
  }
}

/**
 * Disconnect from the database.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
