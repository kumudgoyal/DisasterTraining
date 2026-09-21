import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware.
 * Handles AppError, Prisma errors, Zod validation errors, and generic errors.
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.');
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      },
    });
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: `A record with this ${target} already exists`,
          },
        });
        return;
      }
      case 'P2025':
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Record not found',
          },
        });
        return;
      case 'P2003': {
        const field = (err.meta?.field_name as string) || 'reference';
        res.status(400).json({
          success: false,
          error: {
            code: 'FOREIGN_KEY_VIOLATION',
            message: `Invalid reference: ${field}`,
          },
        });
        return;
      }
      default:
        logger.error('Prisma error', { code: err.code, meta: err.meta, message: err.message });
        res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'A database error occurred',
          },
        });
        return;
    }
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('Prisma validation error', { message: err.message });
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data provided',
      },
    });
    return;
  }

  // JWT errors (already handled in auth middleware, but catch here too)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
      },
    });
    return;
  }

  // Generic/unexpected error
  logger.error('Unhandled error', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
