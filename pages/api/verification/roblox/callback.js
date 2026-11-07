import { ROBLOX_CALLBACK, getCookie, unseal, clearCookie, missingEnvironment, sendResult } from '../../../../lib/oauth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end('Method not allowed');
  const flow = unseal(getCookie(req, 'vf_roblox_flow'));
  clearCookie(res, 'vf_roblox_flow');
  if (req.query.error || !req.query.code) return sendResult(res, 400, 'Verificación de Roblox cancelada', 'No se completó el acceso a Roblox. Vuelve al sitio para empezar de nuevo.');
  if (!flow || !req.query.state || req.query.state !== flow.state || !/^[0-9]{15,22}$/.test(flow.discordUserId || '')) {
    return sendResult(res, 400, 'No se pudo verificar Roblox', 'La sesión expiró o el estado OAuth no coincide. Vuelve a empezar desde el sitio.');
  }

  const missing = missingEnvironment(['ROBLOX_CLIENT_ID', 'ROBLOX_CLIENT_SECRET', 'DISCORD_BOT_TOKEN', 'DISCORD_GUILD_ID', 'DISCORD_VERIFIED_ROLE_ID']);
  if (missing.length) return sendResult(res, 503, 'Verificación sin configurar', `Falta configurar en Vercel: ${missing.join(', ')}.`);
  try {
    const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(req.query.code),
        client_id: process.env.ROBLOX_CLIENT_ID,
        client_secret: process.env.ROBLOX_CLIENT_SECRET,
        redirect_uri: ROBLOX_CALLBACK,
        code_verifier: flow.verifier,
      }),
    });
    if (!tokenResponse.ok) throw new Error(`Roblox token exchange failed (${tokenResponse.status})`);
    const token = await tokenResponse.json();
    const profileResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!profileResponse.ok) throw new Error(`Roblox userinfo failed (${profileResponse.status})`);
    const profile = await profileResponse.json();
    if (!/^\d+$/.test(profile.sub || '') || typeof profile.preferred_username !== 'string') throw new Error('Roblox returned an invalid profile');

    const memberUrl = `https://discord.com/api/v10/guilds/${encodeURIComponent(process.env.DISCORD_GUILD_ID)}/members/${flow.discordUserId}`;
    const memberResponse = await fetch(memberUrl, { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } });
    if (memberResponse.status === 404) return sendResult(res, 403, 'Primero únete al servidor', 'Tu cuenta de Discord no está en el servidor que entrega el rol. Únete y repite la verificación.');
    if (!memberResponse.ok) throw new Error(`Discord member lookup failed (${memberResponse.status})`);

    const roleUrl = `https://discord.com/api/v10/guilds/${encodeURIComponent(process.env.DISCORD_GUILD_ID)}/members/${flow.discordUserId}/roles/${encodeURIComponent(process.env.DISCORD_VERIFIED_ROLE_ID)}`;
    const roleResponse = await fetch(roleUrl, { method: 'PUT', headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } });
    if (!roleResponse.ok) throw new Error(`Discord role assignment failed (${roleResponse.status})`);
    return sendResult(res, 200, 'Cuenta verificada', `Roblox @${profile.preferred_username} quedó verificado y se asignó el rol de Discord.`);
  } catch (error) {
    console.error('Roblox verification callback failed:', error.message);
    return sendResult(res, 502, 'No se pudo completar la verificación', 'Hubo un problema al validar las cuentas o asignar el rol. Revisa la configuración y vuelve a intentarlo.');
  }
}
