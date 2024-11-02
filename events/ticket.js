const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1302222092372152352'; // Channel ID for logging

        // Handle dropdown selection for support tickets and bot purchases
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'supportOptions') {
                const selectedValue = interaction.values[0];

                if (selectedValue === 'st') {
                    const modal = new ModalBuilder()
                        .setCustomId('ticketReasonModal')
                        .setTitle('Ticket Reason');

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for the ticket')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const row = new ActionRowBuilder().addComponents(reasonInput);
                    modal.addComponents(row);

                    await interaction.showModal(modal);
                    return;
                }

                if (selectedValue === 'bp') {
                    const modal = new ModalBuilder()
                        .setCustomId('bpModal')
                        .setTitle('Member Report');

                    const memberInput = new TextInputBuilder()
                        .setCustomId('memberInput')
                        .setLabel('Member Reporting')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Enter the member\'s name or ID...')
                        .setRequired(true);

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for report')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const proofInput = new TextInputBuilder()
                        .setCustomId('proofInput')
                        .setLabel('Proof (if any)')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Provide any proof here...')
                        .setRequired(false);

                    const row1 = new ActionRowBuilder().addComponents(memberInput);
                    const row2 = new ActionRowBuilder().addComponents(reasonInput);
                    const row3 = new ActionRowBuilder().addComponents(proofInput);
                    
                    modal.addComponents(row1, row2, row3);

                    await interaction.showModal(modal);
                    return;
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'bpModal') {
                const member = interaction.fields.getTextInputValue('memberInput');
                const reason = interaction.fields.getTextInputValue('reasonInput');
                const proof = interaction.fields.getTextInputValue('proofInput');

                await interaction.deferReply({ ephemeral: true });

                const purchaseChannel = await interaction.guild.channels.create({
                    name: `report-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1300064496831692891', // Bot Purchase role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const purchaseEmbed = new EmbedBuilder()
                    .setTitle('Member Report')
                    .setDescription(`Hello <@${interaction.user.id}>, member report ticket has been opened. Please wait for staff to assist you.\n**Member Reporting:** ${member}\n**Reason:** ${reason}\n**Proof:** ${proof || 'No proof provided.'}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
                    .setColor('#ffcc5e')
                              .setFooter({ 
                                  text: 'Greenville Roleplay Republic',
                                  iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                              });

                const purchaseCloseButton = new ButtonBuilder()
                    .setCustomId('closePurchaseTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await purchaseChannel.send({ content: `<@${interaction.user.id}>, <@&1300064496831692891>`, embeds: [purchaseEmbed], components: [new ActionRowBuilder().addComponents(purchaseCloseButton)] });

                // Log the ticket opening
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`A new member report ticket has been open by <@${interaction.user.id}> in <#${purchaseChannel.id}>.\n**Member Reporting:** ${member}\n**Reason:** ${reason}`)
                        .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
      .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your ticket has been opened at <#' + purchaseChannel.id + '>.', ephemeral: true });
                return;
            }

            if (interaction.customId === 'ticketReasonModal') {
                const reason = interaction.fields.getTextInputValue('reasonInput');

                await interaction.deferReply({ ephemeral: true });

                const supportChannel = await interaction.guild.channels.create({
                    name: `support-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1300546101191118928', // Support role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const supportEmbed = new EmbedBuilder()
                    .setTitle('Support Ticket')
                    .setDescription(`Hello <@${interaction.user.id}>, your support ticket has been opened. Please wait for staff to assist you.\n**Reason:** ${reason}`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
      .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

                const supportCloseButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await supportChannel.send({ content: `<@${interaction.user.id}>, <@&1300546101191118928>`, embeds: [supportEmbed], components: [new ActionRowBuilder().addComponents(supportCloseButton)] });

                // Log the ticket opening
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`A new support ticket has been opened by <@${interaction.user.id}> in <#${supportChannel.id}>.\n**Reason:** ${reason}`)
                        .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
      .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your support ticket has been opened at <#' + supportChannel.id + '>!', ephemeral: true });
                return;
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'closeTicket' || interaction.customId === 'closePurchaseTicket') {
                const confirmationEmbed = new EmbedBuilder()
                    .setTitle('Close Ticket')
                    .setDescription('Are you sure you want to close this ticket? This action cannot be undone.')
                    .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });
                    
                    

                const finalCloseButton = new ButtonBuilder()
                    .setCustomId('confirmClose')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Secondary);

                await interaction.reply({ embeds: [confirmationEmbed], components: [new ActionRowBuilder().addComponents(finalCloseButton)], ephemeral: true });
                return;
            }

            if (interaction.customId === 'confirmClose') {
                await new Promise((resolve) => setTimeout(resolve, 3000));
            
                const ticketChannel = interaction.channel;
            
                // Create a transcript of the ticket channel
                const transcriptAttachment = await discordTranscripts.createTranscript(ticketChannel, {
    limit: -1, // Fetch all messages
    returnType: 'attachment', // Return type can be 'buffer' | 'string' | 'attachment'
    filename: 'transcript.html', // Name of the attachment
    saveImages: true, // Set to true to include images
    footerText: "Exported {number} message{s}", // Footer text for the transcript
    poweredBy: true, // Include the "Powered by discord-html-transcripts" footer
    hydrate: false, // Hydrate the HTML server-side
    filter: (message) => {
        console.log(`Message fetched: ${message.content}`); // Debug log for messages
        return true; // Include all messages
    } 
});

            
                const ticketOwner = interaction.user;
            
                // Create the embed for the DM
                const closeEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription(`> Hello <@${ticketOwner.id}>, your ticket has been closed. Please find below the information and above the transcript.
                        
                        **Open Time:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}

> If you have any further questions, please feel free to open a new ticket.`)
                    .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
                    .setColor('#ffcc5e')
                              .setFooter({ 
                                  text: 'Greenville Roleplay Republic',
                                  iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                              });
            
                await ticketOwner.send({ embeds: [closeEmbed], files: [transcriptAttachment] }).catch(err => console.error("Failed to send DM: ", err));
            
                await ticketChannel.send('This ticket has been closed.');
                await ticketChannel.delete();

                // Log the ticket closure
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#2F3136')
                        .setTitle('Ticket Closed')
                        .setDescription(`Ticket <#${ticketChannel.id}> has been closed by <@${interaction.user.id}>.`)
                        .setThumbnail("https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&")
      .setColor('#ffcc5e')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });
                    
                    await logChannel.send({ embeds: [logEmbed] });
                }
                return;
            }
        }
    },
};
