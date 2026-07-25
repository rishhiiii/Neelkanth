import env from '../config/env.js';

/**
 * Tiny dependency-free logger. Structured enough to be useful, small enough to
 * swap for pino/winston later without touching call sites.
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const activeLevel = env.isProduction ? LEVELS.info : LEVELS.debug;

function ts() {
  return new Date().toISOString();
}

function log(level, message) {
  if (LEVELS[level] > activeLevel) return;
  const line = `${ts()} [${level.toUpperCase()}] ${message}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

const logger = {
  error: (msg) => log('error', msg),
  warn: (msg) => log('warn', msg),
  info: (msg) => log('info', msg),
  debug: (msg) => log('debug', msg),
};

export default logger;
