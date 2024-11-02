const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ea')
    .setDescription('Grant early access to a user with a link')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('The link for early access')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const staffRoleId = '1300546101191118928'; // Only users with this role can execute the command

      // Check if the user has the required role
      if (!interaction.member.roles.cache.has(staffRoleId)) {
        // If the user doesn't have the required role, reply with a permission error
        return await interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
      }

      // Acknowledge the interaction and respond with an ephemeral message
      await interaction.reply({ content: 'Early access executed successfully!', ephemeral: true });

      const link = interaction.options.getString('link');
      const earlyAccessRoleIds = [
        '1300842680946917418', // First role to be pinged
        '1300842405762695208',
        '1302274834621005878',
        '1300546101191118928',
      ];

      const embed = new EmbedBuilder()
        .setTitle('Greenville Roleplay Republic  | Early Access Released!')
        .setImage('https://cdn.discordapp.com/attachments/1302220069388029995/1302275704700010546/banners_9.png?ex=67278643&is=672634c3&hm=50ff98e9d55470819817931eb79c0b7fdb2343f430f9d4fd5712b90182ff7ce9&')
        .setDescription(`${interaction.user} has now released early access. To join, click on the button below called "Early Access Link". Once you have loaded in, park up and wait until the host has released the session to everyone. Make sure not to leak the link that the host provides to people that aren't on the server and that don't have access to early access.`)
        .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });


      const button = new ButtonBuilder()
        .setLabel('Early Access Link')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('early_access_link');

      const row = new ActionRowBuilder().addComponents(button);

      // Send the embed publicly with role pings
      const message = await interaction.channel.send({
        content: `<@&1300842680946917418> <@&1300842405762695208> <@&1302274834621005878>`, // Pings the roles
        embeds: [embed],
        components: [row]
      });

      // Log the command execution as an embed
      const logChannelId = '1302222092372152352'; // Replace with your log channel ID
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Session Early Access')
          .setDescription(`**User:** <@${interaction.user.id}>\n**Link:** ${link}\n**Date:** ${new Date().toISOString()}`)  
          .setColor('#ffcc5e')
          .setFooter({ 
              text: 'Greenville Roleplay Republic',
              iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
          });

        logChannel.send({ embeds: [logEmbed] });
      }

      const filter = i => i.customId === 'early_access_link' && i.isButton();

      // Create a persistent interaction collector with no timeout
      const collector = message.createMessageComponentCollector({ filter });

      collector.on('collect', async i => {
        try {
          const hasPermission = i.member.roles.cache.has(staffRoleId) ||
            earlyAccessRoleIds.some(roleId => i.member.roles.cache.has(roleId));

          if (!hasPermission) {
            await i.reply({ content: 'You do not have permission to click on this button!', ephemeral: true });
          } else {
            // If the user has permission, send the link in an ephemeral message
            await i.reply({ content: `**Link** ${link}`, ephemeral: true });
          }
        } catch (error) {
          console.error('Error in button interaction:', error);
          await i.reply({ content: 'There was an error handling the button interaction.', ephemeral: true });
        }
      });

    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};
