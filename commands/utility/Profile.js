const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
            const userTag = selectedUser.tag;

            // Define file paths
            const userFilePath = path.join(dataFolderPath, `${userId}.json`);
            const policeRecordFilePath = path.join(policeRecordsDirPath, `${userId}.json`);
            const licenseFilePath = path.join(licensesDirPath, `${userId}.json`);
            const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

            // Load data
            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            let policeRecords = [];
            if (fs.existsSync(policeRecordFilePath)) {
                policeRecords = JSON.parse(fs.readFileSync(policeRecordFilePath, 'utf8'));
            }

            let licenseStatus = 'Active'; // Default to "Active" if no license record exists
            if (fs.existsSync(licenseFilePath)) {
                const licenses = JSON.parse(fs.readFileSync(licenseFilePath, 'utf8'));
                if (licenses.length > 0) {
                    const latestLicense = licenses[licenses.length - 1];
                    licenseStatus = `**Status:** ${latestLicense.status}`;
                }
            }

            const vehicleList = vehicleData.length > 0
                ? vehicleData.map((v, index) =>
                    `**${index + 1}.** Year: ${v.year}, Make: ${v.make}, Model: ${v.model}, Color: ${v.color}, Number Plate: ${v.numberPlate}`).join('\n')
                : 'No vehicles registered.';

            const arrestsList = policeRecords.length > 0
                ? policeRecords.map((r, index) =>
                    `**${index + 1}.** Reason: ${r.reason}\nOffenses: ${r.offenses}\nPrice: ${r.price}\nExecuted By: ${r.executedBy}`).join('\n\n')
                : 'No arrests found.';

            let ticketsList = 'No tickets found.';
            if (fs.existsSync(ticketFilePath)) {
                const tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
                if (tickets.length > 0) {
                    ticketsList = tickets.map((t, index) =>
                        `**${index + 1}.** Offense: ${t.offense}\nPrice: ${t.price}\nCount: ${t.count}`).join('\n\n');
                }
            }

            // Create profile embed
            const profileEmbed = new EmbedBuilder()
                .setTitle(`User's Profile`)
                .setDescription(`
                    The following details contain information regarding the user's registered vehicles, arrest records, issued tickets, and current license status.

**User:**
                    <@${interaction.user.id}>

                    **Vehicles:**
                    ${vehicleList}

                    **Tickets:**
                    ${ticketsList}

                    **License Status:**
                    ${licenseStatus}
                `)
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                })
                .setThumbnail(selectedUser.displayAvatarURL({ dynamic: true }));

            // Send embed
            await interaction.reply({ embeds: [profileEmbed] });

        } catch (error) {
            console.error('An error occurred while executing the command:', error);
            await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    },
};
