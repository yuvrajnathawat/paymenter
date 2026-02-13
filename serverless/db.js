import { PrismaClient } from '@prisma/client';

// Reuse a single PrismaClient instance across hot-reloads in dev
// and across invocations in serverless where possible.

const globalForPrisma = globalThis;

let prismaInstance = globalForPrisma.__bazzarPrisma || null;

if (!prismaInstance) {
  prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__bazzarPrisma = prismaInstance;
  }
}

export const prisma = prismaInstance;

