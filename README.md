# Virtual Football visual + Discord bot

La página principal recrea visualmente la pantalla de Account Linking de Virtual Football. Es una maqueta estática: el botón de Discord no realiza autenticación y no incluye scripts de seguimiento ni una integración OAuth. Vercel conserva la web y el endpoint `/api/interactions`, que responde al comando `/ping`. El proceso aparte en `bot-host/` conecta el bot al Gateway de Discord para que aparezca en línea.

## Configuración en Vercel

En **Project → Settings → Environment Variables**, configura las variables para **Production**:

- `DISCORD_PUBLIC_KEY`: Public Key de la aplicación en Discord. Valida las interacciones.
- `DISCORD_BOT_TOKEN`: token privado del bot. El build lo usa para registrar `/ping`.
- `DISCORD_APPLICATION_ID`: Application ID de Discord.
- `DISCORD_GUILD_ID`: opcional; registra `/ping` en un servidor para probarlo enseguida. Si se omite, se registra globalmente.

Después de cambiar variables, vuelve a desplegar. `vercel.json` hace que el build registre el comando en Production. Las variables no llevan el prefijo `NEXT_PUBLIC_`.

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

El token nunca se guarda en GitHub. `.env.local` está excluido de Git.

## Registro local opcional

```bash
npm install
npm run register-command
```

Para el uso normal, Vercel registra `/ping` durante el build de Production.
