import { DISCORD_CALLBACK, newState, setSignedCookie, missingEnvironment, sendResult } from '../../../../lib/oauth';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end('Method not allowed');
  const missing = missingEnvironment(['DISCORD_APPLICATION_ID', 'DISCORD_OAUTH_CLIENT_SECRET', 'OAUTH_COOKIE_SECRET']);
  if (missing.length) return sendResult(res, 503, 'Verificación sin configurar', `Falta configurar en Vercel: ${missing.join(', ')}.`);

  const state = newState();
  setSignedCookie(res, 'vf_discord_flow', { state });
  const authorize = new URL('https://discord.com/oauth2/authorize');
  authorize.search = new URLSearchParams({
    client_id: process.env.DISCORD_APPLICATION_ID,
    redirect_uri: DISCORD_CALLBACK,
    response_type: 'code',
    scope: 'identify',
    state,
  }).toString();
  return res.redirect(302, authorize.toString());
}
