const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a modal submission
        if (!interaction.isModalSubmit()) return;

        // Check if the modal ID matches
        if (interaction.customId === 'embed_modal') {
            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_description');
            const image = interaction.fields.getTextInputValue('embed_image');
            const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail');

            // Create the embed using EmbedBuilder
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor('#ffcc5e')
                .setFooter({ text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                 });

            // Set the image if provided
            if (image) {
                embed.setImage(image);
            }

            // Set the thumbnail if provided
            if (thumbnail) {
                embed.setThumbnail(thumbnail);
            }

            // Send the embed to the channel where the command was triggered
            const message = await interaction.channel.send({
        embeds: [embed],
      });
        }
    },
};
