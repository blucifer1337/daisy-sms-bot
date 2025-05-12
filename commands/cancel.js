const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancel a phone number rental')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Rental ID from the getnumber command')
        .setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString('id');
      const response = await api.setStatus(id, 8); // 8 is cancel status

      if (response === 'ACCESS_CANCEL') {
        await interaction.editReply({
          embeds: [successEmbed('✅ Successfully canceled the rental. Funds have been returned to your balance.')]
        });
      } else if (response === 'ACCESS_READY') {
        await interaction.editReply({
          embeds: [errorEmbed('❌ Cannot cancel this rental. It may have already been completed or canceled.')]
        });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      logger.error(`Cancel command error: ${error}`);
      await interaction.editReply({
        embeds: [errorEmbed('Failed to cancel rental. Please try again later.')]
      });
    }
  }
};