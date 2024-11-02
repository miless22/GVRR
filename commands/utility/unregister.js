const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const dataFolderPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('Unregister a vehicle from your profile.'),

    async execute(interaction) {
        const user = interaction.user;
        const userId = user.id;

        const userFilePath = path.join(dataFolderPath, `${userId}.json`);

        try {
            let userVehicles = [];
            if (fs.existsSync(userFilePath)) {
                userVehicles = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            if (userVehicles.length === 0) {
                return interaction.reply({ content: 'You have no vehicles registered to unregister.', ephemeral: true });
            }

            const selectMenuOptions = userVehicles.map((vehicle, index) =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Vehicle ${index + 1}`)
                    .setValue(index.toString())
                    .setDescription(`Year: ${vehicle.year}, Make: ${vehicle.make}, Model: ${vehicle.model}`)
            );

            selectMenuOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Remove All Vehicles')
                    .setValue('remove_all')
                    .setDescription('Remove all registered vehicles')
            );

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_vehicle')
                .setPlaceholder('Select a vehicle to unregister or remove all vehicles')
                .addOptions(selectMenuOptions);

            const row = new ActionRowBuilder()
                .addComponents(selectMenu);

            const embed = new EmbedBuilder()
                .setTitle('Your Registered Vehicles')
                .setColor('#ffcc5e')
                .setDescription('Please select the vehicle you want to unregister or choose to remove all vehicles from the dropdown below.')
                .setFooter({ 
                    text: 'Greenville Roleplay Republic',
                    iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                });

            userVehicles.forEach((vehicle, index) => {
                embed.addFields({
                    name: `Vehicle ${index + 1}`,
                    value: `**Year:** ${vehicle.year}\n**Make:** ${vehicle.make}\n**Model:** ${vehicle.model}\n**Color:** ${vehicle.color}\n**Number Plate:** ${vehicle.numberPlate}`,
                    inline: true
                });
            });

            await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });

            const filter = i => i.customId === 'select_vehicle' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async i => {
                if (i.customId === 'select_vehicle') {
                    const selectedValue = i.values[0];

                    if (selectedValue === 'remove_all') {
                        fs.unlinkSync(userFilePath);

                        const confirmationEmbed = new EmbedBuilder()
                            .setTitle('All Vehicles Removed')
                            .setDescription('All your registered vehicles have been successfully removed.')
                            .setColor('#ffcc5e')
                            .setFooter({ 
                                text: 'Greenville Roleplay Republic',
                                iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                            });

                        await i.update({
                            content: 'All your vehicles have been removed.',
                            embeds: [confirmationEmbed],
                            components: [],
                            ephemeral: true
                        });
                    } else {
                        const selectedIndex = parseInt(selectedValue, 10);
                        const removedVehicle = userVehicles.splice(selectedIndex, 1)[0];

                        if (userVehicles.length > 0) {
                            fs.writeFileSync(userFilePath, JSON.stringify(userVehicles, null, 2), 'utf8');
                        } else {
                            fs.unlinkSync(userFilePath);
                        }

                        const confirmationEmbed = new EmbedBuilder()
                            .setDescription(`Vehicle has been successfully unregistered.`)
                            .setColor('#ffcc5e')
                            .setFooter({ 
                                text: 'Greenville Roleplay Republic',
                                iconURL: 'https://cdn.discordapp.com/attachments/1302220069388029995/1302231063573168138/image-photoaidcom-cropped.webp?ex=67275caf&is=67260b2f&hm=cefa2e88be2ea755d9c82fa24e307750c45ae9e7d3d6de38b9d776edc911e1a2&'
                            });

                        await i.update({
                            embeds: [confirmationEmbed],
                            components: [],
                            ephemeral: true
                        });
                    }
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ components: [] }).catch(console.error);
                }
            });

        } catch (error) {
            console.error('Error unregistering vehicle:', error);
            await interaction.reply({ content: 'Failed to unregister vehicle.', ephemeral: true });
        }
    },
};
