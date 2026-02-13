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

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ users }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};

