import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from './logger';

let io: Server | null = null;

/**
 * Initialize Socket.IO with JWT authentication on connection.
 */
export function initializeSocket(server: http.Server): Server {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string; role: string };
      (socket as Socket & { userId?: string; userRole?: string }).userId = decoded.userId;
      (socket as Socket & { userId?: string; userRole?: string }).userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as Socket & { userId?: string }).userId;
    logger.info(`Socket connected: ${socket.id} (user: ${userId})`);

    // Join user-specific room for targeted notifications
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Join state room for state-level updates
    socket.on('subscribe:state', ({ stateId }) => {
      socket.join(`state:${stateId}`);
    });

    // Join training room for training-specific updates
    socket.on('subscribe:training', ({ trainingId }) => {
      socket.join(`training:${trainingId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}

/**
 * Get the Socket.IO server instance.
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

/**
 * Emit an event to a specific user.
 */
export function emitToUser(userId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

/**
 * Emit an event to all connected clients.
 */
export function emitToAll(event: string, data: unknown): void {
  if (io) {
    io.emit(event, data);
  }
}
