const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with using the DaisySMS bot'),
  async execute(interaction) {
    const embed = infoEmbed('ℹ️ DaisySMS Bot Help')
      .setDescription('Here are all the available commands:')
      .addFields(
        {
          name: '💰 /balance',
          value: 'Check your DaisySMS account balance',
          inline: false
        },
        {
          name: '📱 /getnumber <service> <maxprice> [options]',
          value: 'Rent a phone number for SMS verification\n' +
            'Options: areacodes, carriers, longterm, autorenew',
          inline: false
        },
        {
          name: '🔢 /getcode <id> [fullmessage]',
          value: 'Get the verification code for a rented number',
          inline: false
        },
        {
          name: '❌ /cancel <id>',
          value: 'Cancel a phone number rental',
          inline: false
        },
        {
          name: '✅ /done <id>',
          value: 'Mark a rental as done (no longer need to receive SMS)',
          inline: false
        },
        {
          name: '📊 /prices',
          value: 'Get list of services with prices and availability',
          inline: false
        }
      )
      .setFooter({ text: 'For more information, visit daisysms.com' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};