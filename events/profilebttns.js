const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'view_data') {
            const userId = interaction.user.id;

            // Retrieve data from the client
            const vehicleData = interaction.client.vehicleData[userId] || [];
            const ticketsData = interaction.client.ticketsData[userId] || 'No tickets found.';

            // Create an embed to display the data
            const dataEmbed = new EmbedBuilder()
                .setTitle('Your Data')
                .addFields(
                    { name: 'Vehicles', value: vehicleData.length > 0 ? vehicleData.map((v, index) => `**${index + 1}.** ${v.make} ${v.model}`).join('\n') : 'No vehicles registered.', inline: true },
                    { name: 'Tickets', value: ticketsData, inline: true }
                )
                .setColor('#ffcc5e');

            // Send the data embed as ephemeral
            await interaction.reply({ embeds: [dataEmbed], ephemeral: true });
        }
    },
};
