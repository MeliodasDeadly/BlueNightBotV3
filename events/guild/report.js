const client = require("../../index");
const {
    ModalBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle, ChannelType, PermissionsBitField
} = require("discord.js");
const config = require("../../config/config"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'Request',
};
client.on("interactionCreate", async interaction => {

    if (interaction.isButton()) {
        let reaction = await client.db.getData('/report/')
        let selectmenu = await client.db.getData('/selectmenu/')
        reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
        selectmenu = selectmenu.filter(selectmenu => selectmenu.guildId === interaction.guild.id  )

        if (interaction.customId === 'reported') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('mod')
                        .setPlaceholder('Select Tools')
                        .addOptions([
                            {
                                label: '[⚒]: Ban',
                                value: 'banreported',
                            },
                            {
                                label: '[⚒]: Kick',
                                value: 'kickreported',
                            },
                            {
                                label: '[⚒]: TempBan',
                                value: 'tempbanreported',
                            },
                            {
                                label: '[📜]: Warn',
                                value: 'warnreported',
                            }
                        ])
                )
            interaction.reply({
                content: `(Reported) Select your Tools`,
                components: [row],
                ephemeral: true
            })

        }
        if (interaction.customId === 'member') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('mod')
                        .setPlaceholder('Select Tools')
                        .addOptions([
                            {
                                label: '[⚒]: Ban',
                                value: 'banmember',
                            },
                            {
                                label: '[⚒]: Kick',
                                value: 'kickmember',
                            },
                            {
                                label: '[⚒]: TempBan',
                                value: 'tempbanmember',
                            },
                            {
                                label: '[📜]: Warn',
                                value: 'warnmember',
                            }
                        ])
                )
            interaction.reply({
                content: `(Member) Select your Tools`,
                components: [row],
                ephemeral: true
            })
        }
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
            const reporteduser = await client.users.fetch(reaction[0].userId)
            if (interaction.customId === 'bin') {
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
                interaction.reply({
                    content: `Are you sure you want to close the thread?`,
                    components: [row],
                    ephemeral: true
                })
            }
            if (interaction.customId === 'ticket') {
                const embed1 = new EmbedBuilder()
                    .setTitle('Ticket')
                    .setDescription(`✅: Your ticket has been created!`)
                await interaction.reply({
                    embeds: [embed1],
                    ephemeral: true
                })
                const parent = client.channels.cache.get('1040269960724881458');
                const role = interaction.guild.roles.cache.get('1037436624004464700');
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${user.username}`,
                    type: ChannelType.GuildText,
                    parent: parent,
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: reporteduser.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: role.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        }
                    ]
                });
                await channel.permissionOverwrites.edit(interaction.guild.id, {ViewChannel: false});

                const member = interaction.member;
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Ticket for ${user.username}`)
                    .setDescription(`__Reason:__ \n **Report** \n __Ticket ID:__ \n**${channel.id}** \n __Moderator:__ <@${interaction.member.user.id}> \n \n*If you want to close this ticket, please click on the button.*`)
                    .setFooter({
                        text: `Ticket created by ${member.user.username}`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setTimestamp();
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder({
                            style: ButtonStyle.Success,
                            label: "Add User",
                            customId: "adduser",

                        }),
                        new ButtonBuilder({
                            style: ButtonStyle.Danger,
                            label: "Close Ticket",
                            customId: "closeticket"
                        })
                    );
                await channel.send({embeds: [embed], components: [row]});
                interaction.editReply({content: `Ticket created in ${channel}`, ephemeral: true});
                console.log("✅: Ticket created in " + channel.name);
                let tickets = await client.db.getData('/tickets/');
                const guildid = interaction.guild.id;
                const userid = user.id;
                const message = interaction.message.id;


                tickets.push({
                    mode: "tickets",
                    type: "tickets",
                    user: user.tag,
                    userId: userid,
                    memberId: member.user.id,
                    messageId: message,
                    guildId: guildid,
                    modId: interaction.member.user.id,
                    time: Math.round(Date.now() / 1000),
                });
            }
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
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('Member')
                            .setCustomId('member'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('Reported')
                            .setCustomId('reported'),
                    )
                await interaction.reply({
                    content: 'Who did you want to punish?',
                    components: [row],
                    ephemeral: true
                })


            }

        }
    }
});