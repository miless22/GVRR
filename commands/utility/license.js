const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const licensesDirPath = path.join(__dirname, '../../data/licenses');

// Ensure the licenses directory exists
if (!fs.existsSync(licensesDirPath)) {
    fs.mkdirSync(licensesDirPath, { recursive: true });
}

// Replace with your log channel ID
const logChannelId = '1302222092372152352';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('license')
        .setDescription('Set the license status for a specific user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose license status you want to set.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The license status (valid or not valid)')
                .setRequired(true)
                .addChoices(
                    { name: 'Valid', value: 'valid' },
                    { name: 'Invalid', value: 'invalid' })), // Fixed spelling for 'Invalid'

    async execute(interaction) {
        const allowedRoleIds = ['1300842680946917418'];
        const hasAdminRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasAdminRole) {
            const embed = new EmbedBuilder()
                .setDescription('Permission denied.')
                .setColor('#ffcc5e')
                .setFooter({
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const status = interaction.options.getString('status');
        const userId = user.id;
        const filePath = path.join(licensesDirPath, `${userId}.json`);

        const licenseData = { status, date: new Date() };
        fs.writeFileSync(filePath, JSON.stringify([licenseData], null, 2), 'utf8');

        // Send log to the logging channel
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor(status === 'valid' ? '#ffcc5e' : '#ffcc5e')
                .setTitle('License Status Updated')
                .setDescription(`**User:** <@${userId}>\n**Status:** ${status}\n**Updated by:** <@${interaction.user.id}>\n**Date:** ${new Date().toISOString()}`)
                .setFooter({
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error('Log channel not found.');
        }

        await interaction.reply({ content: `License status for <@${userId}> has been set to ${status}.`, ephemeral: true });
    },
};
