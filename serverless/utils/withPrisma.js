import { prisma } from '../db.js';

// Simple retry wrapper to handle cold starts / transient errors
// when connecting to PostgreSQL from serverless environments.

export async function withPrisma(fn, { retries = 2, delayMs = 150 } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn(prisma);
    } catch (err) {
      attempt += 1;

      const isLast = attempt > retries;
      const message = err && err.message ? err.message : String(err);

      const transient =
        /ECONNRESET|ETIMEDOUT|Connection terminated|PRISMA_CONNECTION_ERROR/i.test(message);

      if (!transient || isLast) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
}

