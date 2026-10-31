import { createPublicKey, verify } from 'node:crypto';

export const config = {
  api: { bodyParser: false },
};

const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function isValidDiscordRequest(req, rawBody, publicKeyHex) {
  const signatureHex = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  if (typeof signatureHex !== 'string' || typeof timestamp !== 'string') return false;
  if (!/^[0-9a-f]{128}$/i.test(signatureHex) || !/^\d{1,20}$/.test(timestamp)) return false;
  if (!/^[0-9a-f]{64}$/i.test(publicKeyHex)) return false;

  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false;

  try {
    const key = createPublicKey({
      key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(publicKeyHex, 'hex')]),
      format: 'der',
      type: 'spki',
    });
    return verify(null, Buffer.concat([Buffer.from(timestamp), rawBody]), key, Buffer.from(signatureHex, 'hex'));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) return res.status(500).json({ error: 'DISCORD_PUBLIC_KEY is not configured' });

  const rawBody = await readRawBody(req);
  if (!isValidDiscordRequest(req, rawBody, publicKey)) {
    return res.status(401).json({ error: 'Invalid request signature' });
  }

  let interaction;
  try {
    interaction = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Discord validates the endpoint with a PING and expects a PONG response.
  if (interaction.type === 1) return res.status(200).json({ type: 1 });

  if (interaction.type === 2 && interaction.data?.name === 'ping') {
    return res.status(200).json({
      type: 4,
      data: { content: '🏓 ¡Pong! El bot está en línea.' },
    });
  }

  return res.status(400).json({ error: 'Unsupported interaction' });
}
