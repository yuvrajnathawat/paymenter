import { withPrisma } from '../serverless/utils/withPrisma.js';
import { applyCorsToVercel } from '../serverless/config/cors.js';

export default async function handler(req, res) {
  if (applyCorsToVercel(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await withPrisma((prisma) => prisma.$queryRaw`SELECT 1`);
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message || String(err) });
  }
}

