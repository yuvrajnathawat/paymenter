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
    await withPrisma((prisma) => prisma.$queryRaw`SELECT 1`);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ status: 'ok', db: 'connected' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ status: 'error', message: err.message || String(err) }),
    };
  }
};

