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
4. En **Vercel → Project → Settings → Environment Variables**, añade `DISCORD_PUBLIC_KEY` con la Public Key de Discord. Vuelve a desplegar.
5. En **Discord → General Information**, establece **Interactions Endpoint URL** a `https://TU-DOMINIO.vercel.app/api/interactions`.
6. En **Installation**, habilita la instalación en servidor y el scope `applications.commands`. Instala la aplicación en tu servidor.

Discord verificará el endpoint enviando un PING. La función valida las firmas Ed25519 de Discord y responde `Pong` al comando.

## Registrar `/ping`

En la terminal, dentro de esta carpeta, instala dependencias y copia `.env.example` a `.env.local`. Completa `DISCORD_BOT_TOKEN`, `DISCORD_APPLICATION_ID` y, para que aparezca rápido durante la configuración, el ID de tu servidor en `DISCORD_GUILD_ID`.

```bash
npm install
npm run register-command
```

La variable `DISCORD_BOT_TOKEN` solo se usa para registrar el comando desde tu computadora. No la añadas a Vercel ni al repositorio: las interacciones HTTP de este bot solo necesitan `DISCORD_PUBLIC_KEY`.

## Desarrollo local

```bash
npm install
npm run dev
```

Para que Discord pueda verificar una URL local, el endpoint debe estar publicado temporalmente mediante un túnel HTTPS. Para uso normal, despliega en Vercel y usa la URL de producción.
