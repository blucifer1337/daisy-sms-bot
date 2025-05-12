require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');
const path = require('path');
const fs = require('fs');

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  presence: {
    status: 'online',
    activities: [{
      name: 'DaisySMS Services',
      type: 'WATCHING'
    }]
  }
});

// Command handler setup
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all commands
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    logger.info(`✅ Loaded command: ${command.data.name}`);
  } else {
    logger.warn(`⚠️ Command at ${filePath} is missing required "data" or "execute" property`);
  }
}

// Event: Bot ready
client.once('ready', () => {
  logger.info(`🤖 Bot logged in as ${client.user.tag}`);
  logger.info(`📊 Loaded ${client.commands.size} commands`);
});

// Event: Slash command interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`⚠️ Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    logger.info(`🔄 Executing command: ${interaction.commandName} by ${interaction.user.tag}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(`❌ Command error (${interaction.commandName}): ${error.stack}`);

    // Try to reply to the interaction if it hasn't been replied to yet
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: '❌ An error occurred while executing this command!',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ An error occurred while executing this command!',
        ephemeral: true
      });
    }
  }
});

// Error handling
client.on('error', error => {
  logger.error(`‼️ Client error: ${error.stack}`);
});

process.on('unhandledRejection', error => {
  logger.error(`‼️ Unhandled rejection: ${error.stack}`);
});

// Login to Discord
client.login(process.env.TOKEN)
  .then(() => logger.info('🔑 Bot authentication successful'))
  .catch(error => {
    logger.error(`🔴 Login failed: ${error.stack}`);
    process.exit(1);
  });