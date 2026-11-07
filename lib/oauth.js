import { createHmac, randomBytes, createHash, timingSafeEqual } from 'node:crypto';

export const APP_BASE_URL = (process.env.APP_BASE_URL || 'https://templeague.vercel.app').replace(/\/$/, '');
export const DISCORD_CALLBACK = `${APP_BASE_URL}/api/verification/discord/callback`;
export const ROBLOX_CALLBACK = `${APP_BASE_URL}/verification/callback`;
const COOKIE_AGE_SECONDS = 10 * 60;

function signingKey() {
  const key = process.env.OAUTH_COOKIE_SECRET;
  if (!key || key.length < 32) throw new Error('OAUTH_COOKIE_SECRET must contain at least 32 characters');
  return key;
}

function sign(payload) {
  return createHmac('sha256', signingKey()).update(payload).digest('base64url');
}

export function seal(value) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function unseal(value) {
  if (typeof value !== 'string') return null;
  const [payload, signature, ...extra] = value.split('.');
  if (!payload || !signature || extra.length) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    const result = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return result.exp > Math.floor(Date.now() / 1000) ? result : null;
  } catch {
    return null;
  }
}

export function getCookie(req, name) {
  const item = (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!item) return null;
  try { return decodeURIComponent(item.slice(name.length + 1)); } catch { return null; }
}

export function setSignedCookie(res, name, values) {
  const value = seal({ ...values, exp: Math.floor(Date.now() / 1000) + COOKIE_AGE_SECONDS });
  setCookie(res, name, value, COOKIE_AGE_SECONDS);
}

export function setCookie(res, name, value, age = COOKIE_AGE_SECONDS) {
  const cookie = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  const existing = res.getHeader('Set-Cookie');
  const cookies = Array.isArray(existing) ? existing : existing ? [existing] : [];
  res.setHeader('Set-Cookie', [...cookies, cookie]);
}

export function clearCookie(res, name) {
  setCookie(res, name, '', 0);
}

export function newState() { return randomBytes(32).toString('base64url'); }
export function newVerifier() { return randomBytes(48).toString('base64url'); }
export function challengeFor(verifier) { return createHash('sha256').update(verifier).digest('base64url'); }

export function missingEnvironment(names) {
  return names.filter((name) => !process.env[name]);
}

export function sendResult(res, status, heading, detail) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8').setHeader('Cache-Control', 'no-store').send(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(heading)} · Temp League</title><body style="margin:0;background:#08080d;color:#f7f7fb;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:480px;margin:24px;padding:36px;background:#15151d;border:1px solid #30303a;border-radius:20px;text-align:center"><h1>${escape(heading)}</h1><p style="color:#b7b7c6;line-height:1.6">${escape(detail)}</p><a style="display:inline-block;margin-top:16px;padding:12px 20px;border-radius:10px;background:#5865f2;color:white;text-decoration:none" href="/">Volver al sitio</a></main></body></html>`);
}
