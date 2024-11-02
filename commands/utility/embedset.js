const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedset')
        .setDescription('Open a modal to create an embed'),

    async execute(interaction) {
        // Check if the user has the specific role
        const requiredRoleId = '1300062150647218228';
        const member = interaction.member;

        if (!member.roles.cache.has(requiredRoleId)) {
            // Create an embed for the error message
            const embed = new EmbedBuilder()
                .setColor('#ffcc5e')
                .setDescription('Permission denied!');

            // Send the embed as an ephemeral message
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('embed_modal')
            .setTitle('Create an Embed');

        // Create the title input
        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Create the description input
        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // Create the image link input
        const imageInput = new TextInputBuilder()
            .setCustomId('embed_image')
            .setLabel('Image Link (optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Create the thumbnail input
        const thumbnailInput = new TextInputBuilder()
            .setCustomId('embed_thumbnail')
            .setLabel('Thumbnail (optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Add title and description inputs to the first action row
        const actionRow1 = {
            type: 1, // Action Row
            components: [titleInput],
        };

        // Add description input to a new action row
        const actionRow2 = {
            type: 1, // Action Row
            components: [descriptionInput],
        };

        // Add image link input to another action row
        const actionRow3 = {
            type: 1, // Action Row
            components: [imageInput],
        };

        // Add thumbnail input to a separate action row
        const actionRow4 = {
            type: 1, // Action Row
            components: [thumbnailInput],
        };

        // Add all action rows to the modal
        modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
