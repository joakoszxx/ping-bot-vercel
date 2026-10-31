# Ping Bot backend

Este proyecto solo despliega el endpoint de interacciones de Discord en Vercel. No incluye página web. El endpoint valida las firmas de Discord y responde al comando `/ping`.

## Configuración en Vercel

En **Project → Settings → Environment Variables**, configura las variables para **Production**:

- `DISCORD_PUBLIC_KEY`: Public Key de la aplicación en Discord. Valida las interacciones.
- `DISCORD_BOT_TOKEN`: token privado del bot. El build lo usa para registrar `/ping`.
- `DISCORD_APPLICATION_ID`: Application ID de Discord.
- `DISCORD_GUILD_ID`: opcional; registra `/ping` en un servidor para probarlo enseguida. Si se omite, se registra globalmente.

Después de cambiar variables, vuelve a desplegar. `vercel.json` hace que el build registre el comando en Production. Las variables no llevan el prefijo `NEXT_PUBLIC_`.

En **Discord Developer Portal → General Information**, configura **Interactions Endpoint URL** así:

```text
https://ping-bot-vercel.vercel.app/api/interactions
```

Discord verifica el endpoint con un PING. Para instalar la aplicación, habilita **Guild Install** y el scope `applications.commands` en **Installation**.

## Endpoint

- `POST /api/interactions`: valida `X-Signature-Ed25519` y `X-Signature-Timestamp`, responde al handshake de Discord y a `/ping`.

El token nunca se guarda en GitHub. `.env.local` está excluido de Git.

## Registro local opcional

```bash
npm install
npm run register-command
```

Para el uso normal, Vercel registra `/ping` durante el build de Production.
