const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api');
const { infoEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your DaisySMS account balance'),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      
      const response = await api.getBalance();
      if (response.startsWith('ACCESS_BALANCE:')) {
        const balance = response.split(':')[1];
        await interaction.editReply({
          embeds: [infoEmbed(`💰 Your current balance is: $${balance}`)]
        });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      logger.error(`Balance command error: ${error}`);
      await interaction.editReply({
        embeds: [errorEmbed('Failed to fetch balance. Please try again later.')]
      });
    }
  }
};