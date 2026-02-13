const defaultOrigins = [
  process.env.APP_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

export function applyCorsToVercel(req, res, { origins = defaultOrigins } = {}) {
  const origin = req.headers.origin;

  if (origin && origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

export function applyCorsToNetlify(event, { origins = defaultOrigins } = {}) {
  const origin =
    event.headers.origin ||
    event.headers.Origin ||
    event.headers.referer ||
    '';

  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (origin && origins.some((o) => origin.startsWith(o))) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

