const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('done')
    .setDescription('Mark a rental as done (no longer need to receive SMS)')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Rental ID from the getnumber command')
        .setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const id = interaction.options.getString('id');
      const response = await api.setStatus(id, 6); // 6 is done status

      if (response === 'ACCESS_ACTIVATION') {
        await interaction.editReply({
          embeds: [successEmbed('✅ Successfully marked rental as done.')]
        });
      } else if (response === 'NO_ACTIVATION') {
        await interaction.editReply({
          embeds: [errorEmbed('❌ Invalid rental ID.')]
        });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      logger.error(`Done command error: ${error}`);
      await interaction.editReply({
        embeds: [errorEmbed('Failed to mark rental as done. Please try again later.')]
      });
    }
  }
};