import { ROBLOX_CALLBACK, getCookie, unseal, clearCookie, setSignedCookie, newState, newVerifier, challengeFor, missingEnvironment, sendResult } from '../../../../lib/oauth';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end('Method not allowed');
  const identity = unseal(getCookie(req, 'vf_discord_link'));
  clearCookie(res, 'vf_discord_link');
  if (!identity?.discordUserId) return sendResult(res, 401, 'Inicia sesión con Discord primero', 'Vuelve al sitio y comienza la verificación desde el botón de Discord.');
  const missing = missingEnvironment(['ROBLOX_CLIENT_ID', 'ROBLOX_CLIENT_SECRET', 'OAUTH_COOKIE_SECRET']);
  if (missing.length) return sendResult(res, 503, 'Verificación sin configurar', `Falta configurar en Vercel: ${missing.join(', ')}.`);

  const state = newState();
  const verifier = newVerifier();
  setSignedCookie(res, 'vf_roblox_flow', { state, verifier, discordUserId: identity.discordUserId });
  const authorize = new URL('https://apis.roblox.com/oauth/v1/authorize');
  authorize.search = new URLSearchParams({
    client_id: process.env.ROBLOX_CLIENT_ID,
    redirect_uri: ROBLOX_CALLBACK,
    response_type: 'code',
    scope: 'openid profile',
    state,
    code_challenge: challengeFor(verifier),
    code_challenge_method: 'S256',
  }).toString();
  return res.redirect(302, authorize.toString());
}
