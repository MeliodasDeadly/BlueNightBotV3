const client = require("../../index");
const {
    ModalBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js");
const config = require("../../config/config"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'Request',
};
client.on("interactionCreate", async interaction => {

    if (interaction.isButton()) {
        let reaction = await client.db.getData('/report/')
        reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
        if (interaction.customId === 'yes') {
            const channel = client.channels.cache.get('1037412341647691886');
            await channel.threads.cache.get(interaction.channel.id).delete()
        }
        if (interaction.customId === 'no') {
            await interaction.reply({
                content: '✅: The thread has not been closed!',
                ephemeral: true
            })
        }
        if (reaction[0]?.messageId === interaction.message.id) {
            // get user by reaction.memberId
            const user = await client.users.fetch(reaction[0].memberId)
            if (interaction.customId === 'accept') {
                const embed = new EmbedBuilder()
                    .setDescription(`✅: Your report has been accepted!`)
                    .setColor('Green')
                await user.send({embeds: [embed]}).catch(() => {
                    console.log(`❌: Could not send a message to ${user.tag}`)
                    interaction.reply({
                        content: `❌: Could not send a message to ${user.tag}`,
                        ephemeral: true,
                    })
                }).then(
                    await interaction.reply({
                        content: `✅: Accepted the report, <@${interaction.user.id}> has claimed the ticket !`,
                    })
                )

            }
            if (interaction.customId === 'deny') {
                const embed = new EmbedBuilder()
                    .setDescription(`❌: Your report has been denied!`)
                    .setColor('Red')
                await user.send({embeds: [embed]}).catch(() => {
                    console.log(`❌: Could not send a message to ${user.tag}`)
                    interaction.reply({
                        content: `❌: Could not send a message to ${user.tag}`,
                        ephemeral: true
                    })
                })
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('✓')
                            .setCustomId('yes'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel('X')
                            .setCustomId('no'),
                    )
                await interaction.reply({
                    content: '✅: The report has been denied! Did you want to close the thread?',
                    components: [row],
                    ephemeral: true
                })

            }

            if (interaction.customId === 'mod') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('mod')
                            .setPlaceholder('Select Tools')
                            .addOptions([
                                {
                                    label: '[⚒]: Ban',
                                    value: 'ban',
                                },
                                {
                                    label: '[⚒]: Kick',
                                    value: 'kick',
                                },
                                {
                                    label: '[📜]: Ticket',
                                    value: 'ticket',
                                },
                                {
                                    label: '[📜]: Warn',
                                    value: 'warn',
                                }
                            ])
                    )
                await interaction.reply({
                    content: 'Choice your tools',
                    components: [row],
                    ephemeral: true
                })


            }

        }
    }
});