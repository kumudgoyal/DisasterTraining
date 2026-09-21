import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { unauthorized } from '../utils/errors';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  orgId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * JWT authentication middleware.
 * Extracts and verifies Bearer token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorized('Authentication token is required'));
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(unauthorized('Token has expired'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(unauthorized('Invalid token'));
    }
    next(unauthorized('Authentication failed'));
  }
}

/**
 * Optional authentication middleware.
 * If a valid token is present, attaches user to req. Otherwise, continues without user.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
  } catch {
    // Token invalid, continue without user
  }
  next();
}
