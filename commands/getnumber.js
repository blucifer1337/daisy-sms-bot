const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getnumber')
    .setDescription('Rent a phone number for SMS verification')
    .addStringOption(option =>
      option.setName('service')
        .setDescription('Service shortcode (e.g., ds for Discord)')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('maxprice')
        .setDescription('Maximum price you want to pay (in dollars)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('areacodes')
        .setDescription('Comma-separated area codes (e.g., 212,718)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('carriers')
        .setDescription('Comma-separated carriers (tmo, vz, att)')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('longterm')
        .setDescription('Enable long-term rental')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('autorenew')
        .setDescription('Enable auto-renew for long-term rentals')
        .setRequired(false)),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const service = interaction.options.getString('service');
      const maxPrice = interaction.options.getNumber('maxprice');
      const areaCodes = interaction.options.getString('areacodes');
      const carriers = interaction.options.getString('carriers');
      const longTerm = interaction.options.getBoolean('longterm') || false;
      const autoRenew = interaction.options.getBoolean('autorenew') || false;

      const options = {};
      if (areaCodes) options.areas = areaCodes;
      if (carriers) options.carriers = carriers;
      if (longTerm) options.ltr = 1;
      if (autoRenew) options.auto_renew = 1;

      const response = await api.getNumber(service, maxPrice, options);

      if (response.startsWith('ACCESS_NUMBER:')) {
        const [_, id, number] = response.split(':');
        const embed = successEmbed(`📱 Successfully rented number: +${number}`)
          .addFields(
            { name: 'Rental ID', value: id, inline: true },
            { name: 'Phone Number', value: `+${number}`, inline: true },
            { name: 'Service', value: service.toUpperCase(), inline: true }
          );
        
        if (longTerm) {
          embed.addFields(
            { name: 'Rental Type', value: 'Long-term', inline: true },
            { name: 'Auto-renew', value: autoRenew ? 'Enabled' : 'Disabled', inline: true }
          );
        }

        await interaction.editReply({ embeds: [embed] });
      } else {
        throw new Error(response);
      }
    } catch (error) {
      logger.error(`GetNumber command error: ${error}`);
      let errorMessage = 'Failed to rent a number. ';
      
      if (error.message.includes('NO_NUMBERS')) {
        errorMessage += 'No numbers available for this service.';
      } else if (error.message.includes('MAX_PRICE_EXCEEDED')) {
        errorMessage += 'Current price exceeds your maximum price.';
      } else if (error.message.includes('NO_MONEY')) {
        errorMessage += 'Insufficient balance.';
      } else if (error.message.includes('TOO_MANY_ACTIVE_RENTALS')) {
        errorMessage += 'You have too many active rentals (max 20).';
      } else {
        errorMessage += 'Please try again later.';
      }

      await interaction.editReply({ embeds: [errorEmbed(errorMessage)] });
    }
  }
};