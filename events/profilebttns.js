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
                .setTitle('Records')
                .setDescription(`**Vehicle Information*
                **Vehicles:** ${vehicleData}`)
                .setColor('#ffcc5e');

                const dataEmbed2 = new EmbedBuilder()
                .setDescription(`**Tickets Information**
                **Tickets:** ${ticketsData}`)
                .setColor('#ffcc5e');

            // Send the data embed as ephemeral
            await interaction.reply({ embeds: [dataEmbed, dataEmbed2], ephemeral: true });
        }
    },
};
