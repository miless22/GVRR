const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sends a setup embed'),
    async execute(interaction) {
        // Check if the user has the required role
        const requiredRoleId = '1300546101191118928';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        try {
            // Defer the reply to give the bot time to process
            await interaction.deferReply({ ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Republic | Session Setup')
                .setDescription(`<@${interaction.user.id}> is setting up the session. Please wait for the host to release early access. It will take **__5-15 minutes__** to setup the session.`)    
                .setImage("https://cdn.discordapp.com/attachments/1302220069388029995/1302272163008483413/banners_8.png?ex=672782f6&is=67263176&hm=a12e4628b292ebc00b201f83325999f76f75c755ff0c8d4bb913e86726c851a1&")
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            // Send the message with @everyone ping
            const sentMessage = await interaction.channel.send({embeds: [embed] });

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Setup")
                .setDescription(`<@${interaction.user.id}> is setting up the roleplay session in <#${sentMessage.channel.id}>.`)
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            // Send the new embed to the target channel
            const targetChannelId = '1302222092372152352'; // Your target channel ID
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            if (targetChannel) {
                await targetChannel.send({ embeds: [newEmbed] });
            } else {
                console.error("Target channel not found or invalid.");
            }

            // Acknowledge the interaction
            await interaction.editReply({ content: 'Setup executed successfully!', ephemeral: true });

        } catch (error) {
            console.error("An error occurred: ", error);
            if (error.code === 10062) {
                await interaction.followUp({
                    content: "Your request could not be completed due to an unknown interaction.",
                    ephemeral: true
                });
            } else {
                await interaction.followUp({
                    content: "An error occurred while processing your request.",
                    ephemeral: true
                });
            }
        }
    },
};
