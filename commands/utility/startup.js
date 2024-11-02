const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    
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

            const reactions = interaction.options.getInteger('reactions');

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Republic | Session Startup')
                .setDescription(`<@${interaction.user.id}> has initiated a roleplay session. Ensure you have read and understood the rules before starting. If you are looking to register your vehicle excute the command /register in bot commands to register your vehicle.

For the session to commence, the host needs **${reactions}+** reactions.`)
.setImage("https://cdn.discordapp.com/attachments/1302220069388029995/1302270983427723335/banners_7.png?ex=672781dd&is=6726305d&hm=c5a923340f41e7b8e499da85e47e88656c7c86c45d32618aa2f1ce8c083e4b5b&")
                .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            // Send the message with @everyone ping
            const sentMessage = await interaction.channel.send({ content: '@everyone', embeds: [embed] });

            // React to the message with the custom Check emoji
            await sentMessage.react('✅');

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Startup")
                .setDescription(`<@${interaction.user.id}> has started up a session in <#${interaction.channel.id}>.\n\nReaction count required: ${reactions}.`)
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
            await interaction.editReply({ content: 'Session executed successfully!', ephemeral: true });

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
