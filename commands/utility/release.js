const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Strict Peacetime', value: 'Strict' },
                    { name: 'Normal Peacetime', value: 'Normal' },
                    { name: 'Disabled Peacetime', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '75', value: '75' },
                    { name: '80', value: '80' },
                    { name: '85 (should not be used frequently)', value: '85' }
                )
                .setRequired(true)),

    async execute(interaction) {
        const requiredRoleId = '1300546101191118928'; // Required role ID for verification

        // Check if user has the required role
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have the required role to use this command.', ephemeral: true });
        }

        try {
            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Republic | Session Release')
                .setDescription(`The session host has distributed the link to all participants. Click the button below to view and join the session. Should you encounter any issues or have questions, our support team is available to assist you promptly.\n\n**__Session Information:__**\n\nSession Host: **<@${interaction.user.id}>**\nPeacetime Status: **${peacetimeStatus}**\nFRP Speeds: **${frpSpeed} MPH**`)
                .setImage("https://cdn.discordapp.com/attachments/1302220069388029995/1302277680418525305/banners_10.png?ex=6727881a&is=6726369a&hm=62f2df3d321701e2690b1052d553d0e3162e07ed3bb54a37e5b8015746e3e06e&")
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ls');

            const row = new ActionRowBuilder().addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session in <#${interaction.channel.id}>
                    
                    **Session Information**
                    Peacetime Status: **${peacetimeStatus}**
                    FRP Speeds: **${frpSpeed} MPH**
                    Session Link: ${sessionLink}`)
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            let logChannel;
            try {
                logChannel = await interaction.client.channels.fetch('1302222092372152352');
            } catch (error) {
                console.error('Error fetching log channel:', error);
                return interaction.reply({ content: 'Unable to access the log channel. Please check the bot permissions.', ephemeral: true });
            }

            await logChannel.send({ embeds: [newEmbed] });
            await interaction.channel.send({ content: '@here <@&1302238666701148221>', embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Release executed successfully!', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();
                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle('Session Link Button')
                        .setDescription(`Button clicked by <@${i.user.id}>. Session link in <#${interaction.channel.id}>`)
                        .setColor('#ffcc5e')
                        .setFooter({ 
                            text: 'Greenville Roleplay Republic',
                            iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                        });

                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
