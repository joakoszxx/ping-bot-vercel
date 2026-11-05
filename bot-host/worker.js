import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('DISCORD_BOT_TOKEN is not configured. Set it in the hosting panel.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', (readyClient) => {
  readyClient.user.setPresence({
    status: 'online',
    activities: [{ name: '/ping', type: ActivityType.Listening }],
  });
  console.log(`Discord Gateway connected as ${readyClient.user.tag}`);
});

client.on('error', (error) => {
  console.error('Discord client error:', error.message);
});

client.login(token).catch((error) => {
  console.error('Discord Gateway login failed:', error.message);
  process.exit(1);
});

const shutdown = () => {
  client.destroy();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
