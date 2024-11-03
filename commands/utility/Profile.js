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

            // Store the vehicle, ticket, and license data in the client
            interaction.client.vehicleData = interaction.client.vehicleData || {};
            interaction.client.ticketsData = interaction.client.ticketsData || {};
            interaction.client.arrestData = interaction.client.arrestData || {};
            interaction.client.licensesData = interaction.client.licensesData || {};

            // Define file paths
            const userFilePath = path.join(dataFolderPath, `${userId}.json`);
            const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);
            const policeRecordsFilePath = path.join(policeRecordsDirPath, `${userId}.json`);
            const licenseFilePath = path.join(licensesDirPath, `${userId}.json`);

            // Load vehicle data
            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            // Load tickets
            let ticketsList = 'No tickets found.';
            if (fs.existsSync(ticketFilePath)) {
                const tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
                if (tickets.length > 0) {
                    ticketsList = tickets.map((t, index) =>
                        `**${index + 1}.** Offense: ${t.offense}\nPrice: ${t.price}\nCount: ${t.count}`).join('\n\n');
                }
            }

            // Load police records
            let arrestData = [];
            if (fs.existsSync(policeRecordsFilePath)) {
                arrestData = JSON.parse(fs.readFileSync(policeRecordsFilePath, 'utf8'));
            }

            // Load license status
            let licenseStatus = 'Active'; // Default license status
            if (fs.existsSync(licenseFilePath)) {
                const licenses = JSON.parse(fs.readFileSync(licenseFilePath, 'utf8'));
                licenseStatus = licenses.status || 'Active'; // Set status if it exists
            }

            // Store data in the client
            interaction.client.vehicleData[userId] = vehicleData;
            interaction.client.ticketsData[userId] = ticketsList;
            interaction.client.arrestData[userId] = arrestData;
            interaction.client.licensesData[userId] = licenseStatus;

            // Create profile embed
            const profileEmbed = new EmbedBuilder()
                .setDescription(`**User:** <@${selectedUser.id}>
                    **Vehicle Count:** ${vehicleData.length}
                    **License Status:** ${licenseStatus}`)
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
