import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import routes from './routes';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map(s => s.trim()),
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    },
  });
  app.use('/api', limiter);

  // Request logging
  app.use((req: Request, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent')?.substring(0, 100),
    });
    next();
  });

  // Static file serving for uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Static file serving for reports
  app.use('/storage/reports', express.static(path.join(process.cwd(), 'storage', 'reports')));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // API routes
  app.use('/api/v1', routes);

  // 404 handler for API routes
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'API endpoint not found',
      },
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
