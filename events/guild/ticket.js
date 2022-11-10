const client = require("../../index");
const {PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const config = require("../../config/config"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'Ticket',
};
client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
        let reaction = await client.db.getData('/tickets/')
        reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
        if (interaction.customId === "acceptcloseticket") {
            await interaction.channel.delete()
        }
        if (interaction.customId === "denycloseticket") {
            await interaction.editReply({content: "Cancelled ticket closure.", ephemeral: true})
        }
        if (reaction[0]?.messageId === interaction.message.id) {
                const user = await interaction.guild.members.fetch(reaction[0].userId);
                const guild = interaction.guild;
                if (interaction.customId === "adduser") {
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
                        interaction.reply({
                            content: "Please mention the user you want to add to the ticket.", ephemeral: true
                        })
                        const filter = m => m.author.id === interaction.member.user.id;
                        const collector = interaction.channel.createMessageCollector({filter, time: 15000});
                        const channel = interaction.channel;
                        collector.on('collect', async message => {
                            console.log('4')
                            const member = message.mentions.members.first();
                            if (!member) return interaction.editReply({
                                content: "Please mention a valid user.", ephemeral: true
                            })
                            if (member.id === interaction.member.user.id) return interaction.editReply({
                                content: "You can't add yourself to the ticket.", ephemeral: true
                            })
                            if (member.id === user.id) return interaction.editReply({
                                content: "You can't add the ticket creator to the ticket.", ephemeral: true
                            })
                            if (member.id === client.user.id) return interaction.editReply({
                                content: "You can't add me to the ticket.", ephemeral: true
                            })
                            if (member.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel)) return interaction.editReply({
                                content: "This user is already in a ticket.", ephemeral: true
                            })
                            await channel.permissionOverwrites.create(member, {
                                ViewChannel: true, SendMessages: true, ReadMessageHistory: true, AttachFiles: true,
                            });
                            await interaction.editReply({content: `Added ${member} to the ticket.`, ephemeral: true})
                            channel.bulkDelete(1)
                            // check if member has permission to view the channel
                            collector.stop()
                        })

                    }else{
                        interaction.reply({content: "You don't have permission to add users to the ticket.", ephemeral: true})
                    }
                }
                if (interaction.customId === "closeticket") {
                    const row = new ActionRowBuilder().addComponents(new ButtonBuilder({
                        style: ButtonStyle.Success, label: "✓", customId: "acceptcloseticket",
                    }), new ButtonBuilder({
                        style: ButtonStyle.Danger, label: "X", customId: "denycloseticket",
                    }))
                    interaction.reply({
                        content: "Are you sure you want to close this ticket?", ephemeral: true, components: [row]
                    })
                }



        } else {

        }
    }
});