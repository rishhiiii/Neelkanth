import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB with bounded exponential-backoff retry.
 *
 * On first boot we retry a few times so a slightly-slow / still-starting
 * database (common with docker-compose) doesn't crash the app. Once connected,
 * Mongoose's own driver handles transient reconnects; we only log those.
 */

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

mongoose.set('strictQuery', true);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDB() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('MongoDB connected');
      registerConnectionListeners();
      return mongoose.connection;
    } catch (err) {
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      logger.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (attempt === MAX_RETRIES) {
        throw new Error(`Could not connect to MongoDB after ${MAX_RETRIES} attempts`);
      }
      logger.warn(`Retrying MongoDB connection in ${delay}ms...`);
      await wait(delay);
    }
  }
  return null;
}

function registerConnectionListeners() {
  const { connection } = mongoose;
  connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
}

async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

export { connectDB, disconnectDB };
