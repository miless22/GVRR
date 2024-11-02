const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('proof')
                .setDescription('The proof of the ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const allowedRoleIds = ['1300062150647218228']; // Add the role IDs here

            const hasRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));
            if (!hasRole) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const user = interaction.options.getUser('user');
            const proof = interaction.options.getString('proof');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Republic | Banned')
                .setDescription(`> Hello <@${user}>, you have been banned from Greenville Roleplay Republic. The following reason and proof has been provided below.
                    
                    > **Reason:** ${reason}
                    > **Proof:** ${proof}
                    
                    > If you find this unfair feel free to dm HR or <@1016313124284014593>.
                    -# you have been banned by <@${interaction.user.id}>`)
                .setColor('#ffcc5e')
                .setFooter({
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            try {
                await user.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Failed to send DM to ${user.tag}: ${error}`);
            }

            await interaction.guild.members.ban(user, { reason });
            await interaction.reply({ content: `Successfully banned ${user.tag}`, ephemeral: true });

            // Log the ban in a specific channel
            const logChannelId = '1302222092372152352';
            const logChannel = interaction.client.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('User Banned')
                    .setDescription(`**User:** ${user.tag} (${user.id})\n**Reason:** ${reason}\n**Banned by:** ${interaction.user.tag}\n **Proof:** ${proof}`)
                    .setColor('#ffcc5e')
                    .setFooter({
                        text: 'Greenville Roleplay Republic',
                        iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                    });

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log channel not found');
            }
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error banning the user.', ephemeral: true });
        }
    },
};
