import { DISCORD_CALLBACK, getCookie, unseal, clearCookie, setSignedCookie, missingEnvironment, sendResult } from '../../../../lib/oauth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end('Method not allowed');
  clearCookie(res, 'vf_discord_flow');
  const flow = unseal(getCookie(req, 'vf_discord_flow'));
  if (!flow || !req.query.state || req.query.state !== flow.state) return sendResult(res, 400, 'No se pudo verificar Discord', 'La sesión expiró o el estado OAuth no coincide. Vuelve a intentarlo desde el sitio.');
  if (req.query.error || !req.query.code) return sendResult(res, 400, 'Inicio de Discord cancelado', 'No se completó el acceso a Discord. Puedes volver e intentarlo otra vez.');

  const missing = missingEnvironment(['DISCORD_APPLICATION_ID', 'DISCORD_OAUTH_CLIENT_SECRET', 'OAUTH_COOKIE_SECRET']);
  if (missing.length) return sendResult(res, 503, 'Verificación sin configurar', `Falta configurar en Vercel: ${missing.join(', ')}.`);
  try {
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_APPLICATION_ID,
        client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: String(req.query.code),
        redirect_uri: DISCORD_CALLBACK,
      }),
    });
    if (!tokenResponse.ok) throw new Error(`Discord token exchange failed (${tokenResponse.status})`);
    const token = await tokenResponse.json();
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!userResponse.ok) throw new Error(`Discord profile request failed (${userResponse.status})`);
    const user = await userResponse.json();
    if (!/^[0-9]{15,22}$/.test(user.id || '')) throw new Error('Discord returned an invalid user ID');
    setSignedCookie(res, 'vf_discord_link', { discordUserId: user.id });
    return res.redirect(302, '/api/verification/roblox/start');
  } catch (error) {
    console.error('Discord OAuth callback failed:', error.message);
    return sendResult(res, 502, 'No se pudo conectar con Discord', 'El inicio de sesión no se completó. Vuelve a intentarlo.');
  }
}
