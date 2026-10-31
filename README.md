# Ping Bot

Bot de Discord con un único comando: `/ping`. El sitio informativo y el endpoint de interacciones se despliegan juntos en Vercel.

## Requisitos

- Node.js 20 o superior
- Una aplicación creada en [Discord Developer Portal](https://discord.com/developers/applications)
- Una cuenta de Vercel

## Configuración

1. En Discord Developer Portal, crea una aplicación y copia su **Application ID** y **Public Key** desde *General Information*.
2. En la pestaña **Bot**, genera un token. Guárdalo como secreto; no lo publiques ni lo pegues en el código.
3. Sube esta carpeta a un repositorio Git e impórtalo como proyecto en Vercel.
4. En **Vercel → Project → Settings → Environment Variables**, añade estas variables para **Production**:
   - `DISCORD_PUBLIC_KEY`: la Public Key de Discord; valida las interacciones.
   - `DISCORD_BOT_TOKEN`: el token del bot; solo registra `/ping` durante el build.
   - `DISCORD_APPLICATION_ID`: el Application ID; indica a Discord dónde registrar el comando.
   - `DISCORD_GUILD_ID`: opcional; ID de tu servidor para registrar `/ping` ahí y probarlo enseguida. Si se omite, el comando se registra globalmente.
5. Guarda los cambios y vuelve a desplegar. `vercel-build` registra `/ping` automáticamente si están configurados el token y el Application ID; si aún no los pones, el sitio se despliega y puedes agregarlos más tarde.
6. En **Discord → General Information**, establece **Interactions Endpoint URL** a `https://TU-DOMINIO.vercel.app/api/interactions`.
7. En **Installation**, habilita la instalación en servidor y el scope `applications.commands`. Instala la aplicación en tu servidor.

Discord verificará el endpoint enviando un PING. La función valida las firmas Ed25519 de Discord y responde `Pong` al comando.

## Registrar `/ping`

En Vercel, `DISCORD_BOT_TOKEN` y `DISCORD_APPLICATION_ID` hacen que el build registre el comando. Si prefieres hacerlo manualmente desde tu computadora, copia `.env.example` a `.env.local` (que está excluido de Git) y completa las mismas variables.

```bash
npm install
npm run register-command
```

El token nunca forma parte del código fuente ni se sube a GitHub. En Vercel se usa solo durante el build para registrar el comando; las interacciones del bot se verifican con `DISCORD_PUBLIC_KEY`. No uses el prefijo `NEXT_PUBLIC_` en ninguna variable sensible.

## Desarrollo local

```bash
npm install
npm run dev
```

Para que Discord pueda verificar una URL local, el endpoint debe estar publicado temporalmente mediante un túnel HTTPS. Para uso normal, despliega en Vercel y usa la URL de producción.
