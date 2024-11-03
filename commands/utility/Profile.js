const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

const dataFolderPath = path.join(__dirname, '../../data/vehicleData');
const policeRecordsDirPath = path.join(__dirname, '../../data/policeRecords');
const licensesDirPath = path.join(__dirname, '../../data/licenses');
const ticketsDirPath = path.join(__dirname, '../../data/tickets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays your or another user\'s profile.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to view their profile. If not selected, shows your profile.')),

    async execute(interaction) {
        try {
            const selectedUser = interaction.options.getUser('user') || interaction.user;
            const userId = selectedUser.id;

            // Store the vehicle and ticket data in the client
            interaction.client.vehicleData = interaction.client.vehicleData || {};
            interaction.client.ticketsData = interaction.client.ticketsData || {};

            // Define file paths
            const userFilePath = path.join(dataFolderPath, `${userId}.json`);
            const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

            // Load data
            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            let ticketsList = 'No tickets found.';
            if (fs.existsSync(ticketFilePath)) {
                const tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
                if (tickets.length > 0) {
                    ticketsList = tickets.map((t, index) =>
                        `**${index + 1}.** Offense: ${t.offense}\nPrice: ${t.price}\nCount: ${t.count}`).join('\n\n');
                }
            }

            // Store data in the client
            interaction.client.vehicleData[userId] = vehicleData;
            interaction.client.ticketsData[userId] = ticketsList;

            // Create profile embed
            const profileEmbed = new EmbedBuilder()
                .setTitle(`${selectedUser.tag}'s Profile`)
                .setDescription(`Information regarding the user's registered vehicles and tickets.`)
                .addFields(
                    { name: 'Vehicles', value: vehicleData.length > 0 ? vehicleData.map((v, index) => `**${index + 1}.** ${v.make} ${v.model}`).join('\n') : 'No vehicles registered.', inline: true },
                    { name: 'Tickets', value: ticketsList, inline: true }
                )
                .setColor('#ffcc5e')
                .setThumbnail(selectedUser.displayAvatarURL({ dynamic: true }));

            // Create buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('view_data')
                        .setLabel('View Data')
                        .setStyle(ButtonStyle.Primary)
                );

            // Send embed with buttons
            await interaction.reply({ embeds: [profileEmbed], components: [row] });

        } catch (error) {
            console.error('An error occurred while executing the command:', error);
            await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    },
};
