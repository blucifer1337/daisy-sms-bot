const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api');
const { successEmbed, errorEmbed, warningEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getcode')
    .setDescription('Get the verification code for a rented number')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Rental ID from the getnumber command')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('fullmessage')
        .setDescription('Include full SMS message text')
        .setRequired(false)),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString('id');
      const includeText = interaction.options.getBoolean('fullmessage') || false;

      const response = await api.getStatus(id, includeText);

      if (response.startsWith('STATUS_OK:')) {
        const code = response.split(':')[1];
        const embed = successEmbed(`✅ Verification code received: ${code}`)
          .addFields(
            { name: 'Rental ID', value: id, inline: true },
            { name: 'Code', value: code, inline: true }
          );
        
        await interaction.editReply({ embeds: [embed] });
      } else if (response === 'STATUS_WAIT_CODE') {
        await interaction.editReply({
          embeds: [warningEmbed('🕒 Still waiting for SMS. Please try again in a few seconds.')]
        });
      } else if (response === 'STATUS_CANCEL') {
        await interaction.editReply({
          embeds: [errorEmbed('❌ This rental has been canceled.')]
        });
      } else if (response === 'NO_ACTIVATION') {
        await interaction.editReply({
          embeds: [errorEmbed('❌ Invalid rental ID.')]
        });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      logger.error(`GetCode command error: ${error}`);
      await interaction.editReply({
        embeds: [errorEmbed('Failed to get verification code. Please try again later.')]
      });
    }
  }
};