const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsupport')
    .setDefaultMemberPermissions(0) // Only admins can use this command
    .setDescription('Open a ticket support dropdown.'),
  
  async execute(interaction) {
    // Defer the reply to allow time for processing
    await interaction.deferReply({ ephemeral: true });

    // Create the embed message
    const embed = new EmbedBuilder()
      .setTitle('Server Support')
      .setDescription('> Please select the appropriate option for the ticket you wish to open. Opening a ticket for the wrong reason or for trolling purposes will lead to necessary consequences. We appreciate your patience, as our staff may be attending to multiple inquiries at once.')
      .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
      .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

    // Create the dropdown menu
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('supportOptions')
          .setPlaceholder('Select an option')
          .addOptions([
            {
              label: 'General Support',
              description: `Open a general support ticket.`,
              value: 'st',
            },
            {
              label: 'Member Report',
              description: 'Open a member report ticket.',
              value: 'bp',
            },
          ])
      );

    // Send the embed with the dropdown to the specified channel
    const supportChannel = interaction.guild.channels.cache.get('1301168342299578450');
    if (supportChannel) {
      await supportChannel.send({ embeds: [embed], components: [row] });
      await interaction.editReply({ content: 'The support ticket options have been sent.' });
    } else {
      await interaction.editReply({ content: 'Unable to find the support channel.' });
    }
  },
};
