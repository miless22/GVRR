const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Ends the session and provides session details.')
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1);
        }

        // Format the date to "24 October 2024"
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = now.toLocaleDateString('en-US', options);

        try {
            // Create the session over embed
            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Republic | Session Over')
                .setDescription(` > Thank you for joining the Greenville Roleplay Republic session! We hope you had an enjoyable experience. Please feel free to give your feedback by clicking the button below. 

                **__Session Details:__**
                Session Host: **<@${interaction.user.id}>**
                Start Time: **${startTime}** 
                End Time: **${endTime}**
                Date: **${date}**

                **Note:** Keep in mind that, depending on the severity of the situation, asking for a session may result in an infraction, warning, kick, or even a ban.`)
                .setImage("https://cdn.discordapp.com/attachments/1302220069388029995/1302281184662786198/banners_12.png?ex=67278b5d&is=672639dd&hm=9379a336dc1c98e2364085ab80558cfa7dd9fa0da530e507a5aa4ba8bc6d0552&")
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            // Create the session log embed
            const newEmbed = new EmbedBuilder()
                .setTitle("Session Over")
                .setDescription(`<@${interaction.user.id}> has ended their session in <#${interaction.channel.id}>. 
                    All information has been provided in the message, and the session has been logged in the channel this embed has been sent to.
                    
                    **Information**
                    Start Time: **${startTime}**
                    End Time: **${endTime}**
                    Date: **${date}**`)
                .setThumbnail("https://cdn.discordapp.com/icons/896044016901185556/1d820c210578a4ec519a18b2bb9a00be.png?size=4096")
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            // Create the session rating button
            const button = new ButtonBuilder()
                .setCustomId('session_rating_button')
                .setLabel('Rate Session')
                .setStyle(ButtonStyle.Primary);

            // Create an ActionRow for the button
            const row = new ActionRowBuilder().addComponents(button);

            // Send the embed to the current channel, mentioning everyone
            await interaction.channel.send({
                embeds: [embed],
                components: [row]
            });

            // Send session log to the specified log channel
            const logChannel = await interaction.client.channels.fetch('1302222092372152352');
            await logChannel.send({ embeds: [newEmbed] });

            // Reply to the interaction to confirm the command was executed
            await interaction.reply({ content: 'Over executed successfully!', ephemeral: true });
        } catch (error) {
            console.error('Error sending messages:', error);
            await interaction.reply({ content: 'Failed to send messages. Please try again later.', ephemeral: true });
        }
    },
};
