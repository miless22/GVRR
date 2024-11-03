const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffinfo')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays server information'),
    async execute(interaction) {
        const targetChannelId = '1301168533979533372';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true }).catch(console.error);

        if (!targetChannel) {
            // If the channel isn't found, reply right away to prevent timeout
            return await interaction.editReply({ content: 'Channel not found!', ephemeral: true }).catch(console.error);
        }

        // Send a "please wait" message
        await interaction.editReply({ content: 'Please wait while I set this up...', ephemeral: true }).catch(console.error);

        // Simulate setup time with a delay
        setTimeout(async () => {
            const rulesEmbed = new EmbedBuilder()
                .setTitle(`Staff Information`)
                .setDescription(`As a GVRR staff member, you are expected to follow the rules provided to you. Failing to do so would result in a termination. If you need help, contanct HR. 
                    
                    **Leaking or sharing staff information in other server is strictly prohibited. Doing so would result in a termination from the staff team**.`)
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('staff')
                .setPlaceholder('Select an option')
                .addOptions([
                    { label: 'Information ', description: 'Click here to view the information.', value: 'info' },
                    { label: 'Session Commands', description: `These's are the session commands in the server`, value: 'sc' },
                    { label: 'Moderation Commands', description: `These's are the moderation commands in the server`, value: 'mod' },
                    { label: 'Qouta Information', description: 'Information about the server qouta.' , value: 'qi' },
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            // Try sending the embed and select menu to the specified channel
            try {
                await targetChannel.send({ embeds: [rulesEmbed], components: [row] });
                // Confirm the action in the interaction reply
                await interaction.followUp({ content: 'Embed has been sent.', ephemeral: true });
            } catch (error) {
                console.error('Error sending embeds:', error);
                // If there's an error sending the embeds, handle it gracefully
                await interaction.followUp({ content: 'Failed to send server rules to the channel.', ephemeral: true }).catch(console.error);
            }
        }, 5000); // Wait for 5000 milliseconds (5 seconds)
    },
};
