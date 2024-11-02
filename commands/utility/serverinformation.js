const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinformation')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays server information'),
    async execute(interaction) {
        const targetChannelId = '1301165831467700344';
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
                .setTitle(`Greenville Roleplay Republic`)
                .setDescription(`**Greenville Roleplay Republic** is a roleplay server based off [Greenville](https://www.roblox.com/games/891852901/HALLOWEEN-EVENT-MAP-CHANGES-CARS-Greenville). Our main goal is to give realistic experiences in Greenville.
                    
                    Just note if you fail to follow all the rules we provided for you in the dropdown options below, you will be banned from the server. If any support is needed, make a ticket in <#1301168342299578450>`)
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('work213')
                .setPlaceholder('Select an option')
                .addOptions([
                    { label: 'Server Information', description: 'Click here to view server information.', value: 'sf222' },
                    { label: 'Roleplay Information', description: 'Click here to view roleplay information.', value: 'rf22' },
                    { label: 'Server Links', description: 'Click here to view server links.', value: 'sl22' },
                    { label: 'Session Ping', description: 'Click here to earn/remove the session ping role.', value: 'sp22' }
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
