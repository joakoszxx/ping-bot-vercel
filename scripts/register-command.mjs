const { DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_APPLICATION_ID) {
  console.error('Configura DISCORD_BOT_TOKEN y DISCORD_APPLICATION_ID antes de registrar /ping.');
  process.exit(1);
}

const command = {
  name: 'ping',
  description: 'Comprueba si el bot está en línea.',
  type: 1,
};

const scope = DISCORD_GUILD_ID
  ? `applications/${DISCORD_APPLICATION_ID}/guilds/${DISCORD_GUILD_ID}/commands`
  : `applications/${DISCORD_APPLICATION_ID}/commands`;

const response = await fetch(`https://discord.com/api/v10/${scope}`, {
  method: 'PUT',
  headers: {
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify([command]),
});

if (!response.ok) {
  const detail = await response.text();
  console.error(`Discord rechazó el registro (${response.status}): ${detail}`);
  process.exit(1);
}

console.log(`Comando /ping registrado ${DISCORD_GUILD_ID ? 'en el servidor' : 'globalmente'}.`);
