const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const userId = interaction.user.id;

        // Handle button interactions
        if (interaction.customId === 'registrations') {
            const vehicleData = interaction.client.vehicleData[userId] || [];

            // Create an embed to display vehicle data
            const vehiclesEmbed = new EmbedBuilder()
                .setTitle('Registered Vehicles')
                .setColor('#ffcc5e')
                .setDescription(
                    vehicleData.length > 0
                        ? vehicleData.map((v, index) => `**${index + 1}.** Year: ${v.year}, Make: ${v.make}, Model: ${v.model}, Color: ${v.color}, Number Plate: ${v.numberPlate}`).join('\n')
                        : `No vehicles have been registered for <@${userId}>`
                );

            // Send the vehicles embed as ephemeral
            await interaction.reply({ embeds: [vehiclesEmbed], ephemeral: true });

        } else if (interaction.customId === 'records') {
            const ticketsData = interaction.client.ticketsData[userId] || `No arrests records found for <@${userId}>.`;
            const arrestData = interaction.client.arrestData[userId] || `No arrests records found for <@${userId}>.`;

            // Create an embed to display tickets and arrest records
            const recordsEmbed = new EmbedBuilder()
                .setTitle('Records')
                .setColor('#ffcc5e')
                .addFields(
                    { name: 'Tickets', value: ticketsData, inline: true },
                    { name: 'Arrests', value: arrestData.length > 0 ? arrestData.map((r, index) => `**${index + 1}.** Reason: ${r.reason}\nOffenses: ${r.offenses}\nPrice: ${r.price}\nExecuted By: ${r.executedBy}`).join('\n\n') : 'No arrests found.', inline: true }
                );

            // Send the records embed as ephemeral
            await interaction.reply({ embeds: [recordsEmbed], ephemeral: true });
        }
    },
};
