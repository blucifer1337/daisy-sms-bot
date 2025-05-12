const { EmbedBuilder } = require('discord.js');

const createEmbed = (title, description, color = 0x0099FF) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'DaisySMS Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
};

const errorEmbed = (description) => {
  return createEmbed('❌ Error', description, 0xFF0000);
};

const successEmbed = (description) => {
  return createEmbed('✅ Success', description, 0x00FF00);
};

const infoEmbed = (description) => {
  return createEmbed('ℹ️ Information', description, 0x3498DB);
};

const warningEmbed = (description) => {
  return createEmbed('⚠️ Warning', description, 0xFFA500);
};

module.exports = {
  createEmbed,
  errorEmbed,
  successEmbed,
  infoEmbed,
  warningEmbed
};