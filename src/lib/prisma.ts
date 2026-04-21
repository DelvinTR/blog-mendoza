import { PrismaClient } from '@prisma/client';

/**
 * Global singleton for PrismaClient.
 * Prevents multiple instances during development hot-reloads
 * and ensures a single connection pool in production.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
