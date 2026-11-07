# Virtual Football visual + Discord bot

La página principal recrea visualmente la pantalla de Account Linking de Virtual Football. El botón de la página tiene un flujo OAuth propio. El botón del panel de Discord sigue usando `verification.js` en Wispbyte; Vercel ofrece una ruta HTTPS que reenvía el callback de Roblox a ese proceso. Vercel también conserva el endpoint `/api/interactions`, que responde al comando `/ping`.

## Configuración en Vercel

En **Project → Settings → Environment Variables**, configura las variables para **Production**:

- `DISCORD_PUBLIC_KEY`: Public Key de la aplicación en Discord. Valida las interacciones.
- `DISCORD_BOT_TOKEN`: token privado del bot. El build lo usa para registrar `/ping`.
- `DISCORD_APPLICATION_ID`: Application ID de Discord.
- `DISCORD_GUILD_ID`: opcional; registra `/ping` en un servidor para probarlo enseguida. Si se omite, se registra globalmente.
- `DISCORD_OAUTH_CLIENT_SECRET`: client secret OAuth de la misma aplicación Discord.
- `DISCORD_VERIFIED_ROLE_ID`: ID del rol que se otorga tras verificar Roblox. El bot debe tener **Manage Roles** y su rol más alto debe estar por encima de este rol.
- `APP_BASE_URL`: origen público, `https://templeague.vercel.app`.
- `OAUTH_COOKIE_SECRET`: secreto aleatorio de al menos 32 caracteres para proteger el estado temporal de OAuth.
- `ROBLOX_CLIENT_ID` y `ROBLOX_CLIENT_SECRET`: credenciales de la app OAuth creada en Roblox Creator Dashboard.
- `WISPBYTE_CALLBACK_TARGET`: URL HTTPS con certificado válido del endpoint Express de Wispbyte, terminada en `/verification/callback`.

Después de cambiar variables, vuelve a desplegar. `vercel.json` hace que el build registre el comando en Production. Las variables no llevan el prefijo `NEXT_PUBLIC_`.

En la configuración de OAuth de Discord registra este redirect URI:

```text
https://templeague.vercel.app/api/verification/discord/callback
```

Para la verificación iniciada desde el panel del bot, en Roblox Creator Dashboard registra este Redirect URL:

```text
https://templeague.vercel.app/verification/callback
```

Para el flujo separado iniciado desde el botón de la web, registra también esta URL y habilita `openid` y `profile`:

```text
https://templeague.vercel.app/api/verification/roblox/callback
```

En **Wispbyte**, configura `PUBLIC_BASE_URL=https://templeague.vercel.app` y conserva allí `ROBLOX_CLIENT_ID` y `GUILD_ID`. El endpoint de Vercel reenvía `code` y `state` por HTTPS al callback Express de Wispbyte, donde `verification.js` valida el estado, usa el verificador PKCE, actualiza el nickname y guarda `verification.json`. La ruta `/verification/callback` de Vercel no completa el flujo por sí sola; Wispbyte debe ofrecer un hostname con HTTPS y certificado válido.

En **Discord Developer Portal → General Information**, configura **Interactions Endpoint URL** así:

```text
https://templeague.vercel.app/api/interactions
```

## Bot en línea en FadeHost

FadeHost ejecuta el bot con `npm start` desde la raíz del repositorio. El proceso en `bot-host/` mantiene la presencia de Discord en línea y muestra `/ping` como actividad; el comando sigue respondiendo desde Vercel. FadeHost recibe el token del bot en su campo **Discord bot token** y lo pasa al proceso como `DISCORD_BOT_TOKEN`. No guardes el token en GitHub.

El plan gratuito de FadeHost incluye un bot con 256 MB, sin suspensión por inactividad, pero pide confirmar cada pocos días desde un correo para mantenerlo activo. El plan gratuito no incluye garantía de disponibilidad continua.

Discord verifica el endpoint con un PING. Para instalar la aplicación, habilita **Guild Install** y el scope `applications.commands` en **Installation**.

## Endpoint

- `POST /api/interactions`: valida `X-Signature-Ed25519` y `X-Signature-Timestamp`, responde al handshake de Discord y a `/ping`.
- `GET /api/verification/discord/start` y `/api/verification/discord/callback`: autentican la cuenta Discord.
- `GET /verification/callback`: reenvía el callback del panel Discord a Wispbyte.
- `GET /api/verification/roblox/start` y `/api/verification/roblox/callback`: flujo OAuth separado de la página web; asigna el rol configurado en Discord.

El token nunca se guarda en GitHub. `.env.local` está excluido de Git.

## Registro local opcional

```bash
npm install
npm run register-command
```

Para el uso normal, Vercel registra `/ping` durante el build de Production.
