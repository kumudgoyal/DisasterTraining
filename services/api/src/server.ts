import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './utils/socket';
import { logger } from './utils/logger';
import { AlertService } from './services/alert.service';
import cron from 'node-cron';

async function main() {
  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.IO
  initializeSocket(server);

  // Schedule alert checking every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    logger.info('Running scheduled alert check...');
    try {
      await AlertService.checkAndCreateAlerts();
      logger.info('Alert check completed');
    } catch (error) {
      logger.error('Alert check failed', { error: (error as Error).message });
    }
  });

  // Start the server
  server.listen(env.API_PORT, env.API_HOST, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode`);
    logger.info(`API available at http://${env.API_HOST}:${env.API_PORT}/api/v1`);
    logger.info('Socket.IO server ready');
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
  });
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });
}

main().catch((error) => {
  logger.error('Failed to start server', { error: (error as Error).message });
  process.exit(1);
});
