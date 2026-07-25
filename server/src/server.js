import env from './config/env.js';
import logger from './utils/logger.js';
import { connectDB, disconnectDB } from './config/db.js';
import createApp from './app.js';

/**
 * Process entry point: connect to the database first, then start the HTTP
 * server. Handles graceful shutdown and last-resort crash guards.
 */
async function start() {
  try {
    await connectDB();

    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port} [${env.nodeEnv}]`);
    });

    const shutdown = async (signal) => {
      logger.warn(`${signal} received, shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('Shutdown complete');
        process.exit(0);
      });
      // Force-exit if graceful shutdown stalls
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

// Last-resort guards for programmer errors
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled promise rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

start();
