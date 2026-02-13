import { withPrisma } from '../../serverless/utils/withPrisma.js';
import { applyCorsToNetlify } from '../../serverless/config/cors.js';

export const handler = async (event) => {
  const corsHeaders = applyCorsToNetlify(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const userId = event.headers['x-user-id'] || event.headers['X-User-Id'];

  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing user identifier' }),
    };
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
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ user }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};

