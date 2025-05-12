const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prices')
        .setDescription('Get current SMS service prices'),

    async execute(interaction) {
        try {
            // Defer reply as API call may take time
            await interaction.deferReply();

            // Fetch prices from API
            const apiUrl = 'https://daisysms.com/stubs/handler_api.php?api_key=9kn2ApwJ0grvg80nUbPHKiVunGemZ2&action=getPrices';
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            // Validate API response structure
            if (!data || typeof data !== 'object' || !data['187']) {
                throw new Error('Invalid API response format');
            }

            // Process services into sorted array
            const services = [];
            for (const [code, service] of Object.entries(data['187'])) {
                services.push({
                    name: service.name,
                    cost: parseFloat(service.cost),
                    count: service.count,
                    repeatable: service.repeatable,
                    code: code
                });
            }

            // Sort by price (cheapest first)
            services.sort((a, b) => a.cost - b.cost);

            // Create pages for pagination
            const itemsPerPage = 10;
            const pages = [];
            for (let i = 0; i < services.length; i += itemsPerPage) {
                const currentServices = services.slice(i, i + itemsPerPage);
                
                const embed = new EmbedBuilder()
                    .setTitle('📊 Current SMS Service Prices')
                    .setColor('#FF69B4')
                    .setFooter({ text: `Page ${Math.floor(i / itemsPerPage) + 1}/${Math.ceil(services.length / itemsPerPage)} | Total Services: ${services.length}` })
                    .setTimestamp();

                currentServices.forEach(service => {
                    embed.addFields({
                        name: `${service.name} (${service.code})`,
                        value: [
                            `💵 Price: $${service.cost.toFixed(2)}`,
                            `📦 Stock: ${service.count}`,
                            `🔄 Repeatable: ${service.repeatable ? 'Yes' : 'No'}`
                        ].join('\n'),
                        inline: true
                    });
                });

                pages.push(embed);
            }

            // If only one page, just send it
            if (pages.length === 1) {
                return await interaction.editReply({ embeds: [pages[0]] });
            }

            // Create pagination buttons
            let currentPage = 0;
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('⬅ Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next ➡')
                        .setStyle(ButtonStyle.Primary)
                );

            // Send first page with buttons
            const message = await interaction.editReply({
                embeds: [pages[currentPage]],
                components: [row]
            });

            // Create collector for button interactions
            const collector = message.createMessageComponentCollector({
                time: 300000 // 5 minutes
            });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: 'You cannot control this pagination!', ephemeral: true });
                }

                if (i.customId === 'previous') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

                // Update button states
                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled(currentPage === pages.length - 1);

                // Update message with new page
                await i.update({
                    embeds: [pages[currentPage]],
                    components: [row]
                });
            });

            collector.on('end', () => {
                // Disable buttons when collector ends
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                message.edit({ components: [row] }).catch(() => {});
            });

        } catch (error) {
            console.error('Prices command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error Fetching Prices')
                .setDescription('Failed to retrieve prices. Please try again later.')
                .addFields({
                    name: 'Technical Details',
                    value: `\`\`\`${error.message}\`\`\``
                });

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};