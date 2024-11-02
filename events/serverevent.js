const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            const { customId, values } = interaction;

            if (customId === 'work213') {
                const selectedValue = values[0];
                let embed;

                // Create the embed based on the selected value
                if (selectedValue === 'sf222') {
                    embed = new EmbedBuilder()
                        .setDescription(`
**[1] Age Requirement:**  
All members must be at least 13 years old to participate. Any member found to be under this age will be banned and may appeal their ban upon reaching the age requirement. This is to ensure compliance with Discord’s Terms of Service.

**[2] NSFW Content:**  
Posting NSFW content is strictly prohibited in any channel. A warning will be issued for initial offenses; repeated violations may result in an immediate ban.

**[3] Instigating Drama:**  
Creating or participating in drama is not tolerated. Members found instigating conflicts will receive a warning and may face further consequences for continued behavior.

**[4] Offensive Comments/Slurs:**  
We have a zero-tolerance policy for any form of hate speech, including racial, gendered, or ethnic slurs. Violators will be banned immediately.

**[5] Member Respect:**  
Every member is expected to treat others with respect and kindness. Conflicts should be resolved privately. Harassment or bullying will result in disciplinary action.

**[6] Staff Orders:**  
Members must comply with the directives given by Server Staff. Failure to follow instructions may result in disciplinary measures.

**[7] Advertising:**  
Advertising other servers or services is not allowed. This includes promotion through direct messages or public channels.

**[8] Assets:**  
Stealing assets from GVRR would result in a permanent ban and a DMCA takedown of the requested.

**[9] Terms of Service:**  
All members are required to adhere to the ROBLOX and Discord Terms of Service. Violations may result in disciplinary action.
`)
                        .setColor('#ffcc5e')
                        .setFooter({ 
                            text: 'Greenville Roleplay Republic', 
                            iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&' 
                        });
                } else if (selectedValue === 'sp22') {
                    const pingRoleId = '1302238666701148221';
                    const button = new ButtonBuilder()
                        .setCustomId('togglePingRole')
                        .setLabel('Toggle Session Ping Role')
                        .setStyle(ButtonStyle.Primary);

                    // Create the ephemeral embed with the button
                    const embed = new EmbedBuilder()
                        .setDescription('Click the button below to add/remove the session ping role.')
                        .setColor('#ffcc5e')
                        .setFooter({ 
                            text: 'Greenville Roleplay Republic', 
                            iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&' 
                        });

                    // Send the embed with the button as an ephemeral message
                    await interaction.reply({ 
                        embeds: [embed],
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(button)]
                    });
                    return; // Exit early for this case
                }

                // If an embed was created, send it as an ephemeral response
                if (embed) {
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
        }

        // Handle button interaction for toggling the role
        if (interaction.isButton()) {
            if (interaction.customId === 'togglePingRole') {
                const pingRoleId = '1302238666701148221';
                const member = interaction.member;

                // Toggle the session ping role
                if (member.roles.cache.has(pingRoleId)) {
                    await member.roles.remove(pingRoleId);
                    await interaction.reply({ content: 'Session ping role removed.', ephemeral: true });
                } else {
                    await member.roles.add(pingRoleId);
                    await interaction.reply({ content: 'Session ping role added.', ephemeral: true });
                }
            }
        }
    },
};
