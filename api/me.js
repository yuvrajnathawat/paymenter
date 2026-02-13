import { withPrisma } from '../serverless/utils/withPrisma.js';
import { applyCorsToVercel } from '../serverless/config/cors.js';

// Example read-only "me" endpoint that expects a user id from a header.
// In production, you should validate a JWT or session instead.

export default async function handler(req, res) {
  if (applyCorsToVercel(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = req.headers['x-user-id'];

  if (!userId) {
    res.status(401).json({ error: 'Missing user identifier' });
    return;
  }

  try {
    const user = await withPrisma((prisma) =>
      prisma.user.findUnique({
        where: { id: Number(userId) || 0 },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
}

