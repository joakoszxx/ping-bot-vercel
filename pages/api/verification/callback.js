const CALLBACK_FIELDS = ['code', 'state', 'error', 'error_description', 'iss'];

function getSingleValue(value) {
  return typeof value === 'string' ? value : null;
}

function plainText(res, status, message) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(status).send(message);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end('Method not allowed');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const targetValue = process.env.WISPBYTE_CALLBACK_TARGET;
  if (!targetValue) return plainText(res, 503, 'WISPBYTE_CALLBACK_TARGET is not configured.');

  let target;
  try {
    target = new URL(targetValue);
    if (target.protocol !== 'https:' || target.username || target.password || target.search || target.hash || !target.pathname.endsWith('/verification/callback')) {
      throw new Error('Invalid callback target');
    }
  } catch {
    return plainText(res, 500, 'WISPBYTE_CALLBACK_TARGET must be an HTTPS URL ending in /verification/callback.');
  }

  for (const field of CALLBACK_FIELDS) {
    if (req.query[field] !== undefined) {
      const value = getSingleValue(req.query[field]);
      if (value === null) return plainText(res, 400, 'Invalid OAuth callback parameters.');
      target.searchParams.set(field, value);
    }
  }

  if (!target.searchParams.has('state') || (!target.searchParams.has('code') && !target.searchParams.has('error'))) {
    return plainText(res, 400, 'Missing OAuth callback state or result.');
  }

  try {
    const upstream = await fetch(target, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const body = await upstream.arrayBuffer();
    return res.status(upstream.status).send(Buffer.from(body));
  } catch (error) {
    console.error('Wispbyte OAuth callback relay failed:', error.message);
    return plainText(res, 502, 'Could not reach the verification server on Wispbyte.');
  }
}
