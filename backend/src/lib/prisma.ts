import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (e) => {
    logger.debug('DB Query', { query: e.query, duration: e.duration });
  });
}

prisma.$on('error', (e) => {
  logger.error('DB Error', { message: e.message });
});

export default prisma;
