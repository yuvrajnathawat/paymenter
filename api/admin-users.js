import { withPrisma } from '../serverless/utils/withPrisma.js';
import { applyCorsToVercel } from '../serverless/config/cors.js';

// Minimal example of an admin users list endpoint.
// This is read-only and does not implement auth. Add authentication
// (e.g. JWT validation) before using in production.

export default async function handler(req, res) {
  if (applyCorsToVercel(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const users = await withPrisma((prisma) =>
      prisma.user.findMany({
        take: 50,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
    );

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
}

