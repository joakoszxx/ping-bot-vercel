# Virtual Football visual + Discord bot

La página principal recrea visualmente la pantalla de Account Linking de Virtual Football. El botón permite autenticar Discord y Roblox mediante OAuth; tras verificar Roblox, Vercel asigna el rol configurado en Discord. Vercel también conserva el endpoint `/api/interactions`, que responde al comando `/ping`. El proceso aparte en `bot-host/` conecta el bot al Gateway de Discord para que aparezca en línea.

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

Después de cambiar variables, vuelve a desplegar. `vercel.json` hace que el build registre el comando en Production. Las variables no llevan el prefijo `NEXT_PUBLIC_`.

En la configuración de OAuth de Discord registra este redirect URI:

```text
https://templeague.vercel.app/api/verification/discord/callback
```

En Roblox Creator Dashboard registra exactamente este Redirect URL y habilita los scopes `openid` y `profile`:

```text
https://templeague.vercel.app/verification/callback
```

El flujo valida `state`, usa PKCE para Roblox y solo guarda una cookie firmada de vida corta en el navegador. No se guardan los tokens OAuth. La persona debe estar ya dentro del servidor Discord para recibir el rol.

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
- `GET /api/verification/roblox/start` y `/verification/callback`: autentican Roblox y asignan el rol de Discord.

El token nunca se guarda en GitHub. `.env.local` está excluido de Git.

## Registro local opcional

```bash
npm install
npm run register-command
```

Para el uso normal, Vercel registra `/ping` durante el build de Production.
