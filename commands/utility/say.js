const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send a message as the bot.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
        
    async execute(interaction) {
        const allowedRoleIds = ['1300062150647218228'];
        const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasAllowedRole) {
            const embed = new EmbedBuilder()
                .setDescription('Permission denied.')
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const message = interaction.options.getString('message');

        // Send the message in the channel where the command was used
        await interaction.channel.send(message);

        // Log the message in the specified channel
        const logChannel = interaction.guild.channels.cache.get('1302222092372152352');
        if (logChannel) {
            await logChannel.send(`Message from <@${interaction.user.id}>: ${message}. Channel: <#${interaction.channel.id}>`);
        } else {
            console.error('Log channel not found.');
        }

        // Acknowledge the interaction
        await interaction.reply({ content: 'Message sent!', ephemeral: true });
    },
};
