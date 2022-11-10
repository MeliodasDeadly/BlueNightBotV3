const client = require("../../index");
const {ModalBuilder, EmbedBuilder} = require("discord.js");
const config = require("../../config/config"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'Request',
};
client.on("interactionCreate", async interaction => {

    if (interaction.isButton()) {
        let reaction = await client.db.getData('/request/')
        reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
        //console.log(reaction)
        //console.log(reaction[0].messageId)
        //console.log(interaction.message.id)
        if (reaction[0]?.messageId === interaction.message.id) {
            console.log("1")
            const banrequest = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
            const warnrequest = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
            const kickrequest = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.messageId === interaction.message.id)
            const banmember = await interaction.guild.members.fetch(reaction[0].userId);
            const warnmember = await interaction.guild.members.fetch(reaction[0].userId);
            const kickmember = await interaction.guild.members.fetch(reaction[0].userId);
            const user = await interaction.guild.members.fetch(reaction[0].userId);
            const guild = interaction.guild;
            const reason = reaction[0].reason;

            const {TextInputBuilder, ActionRowBuilder, TextInputStyle} = require("discord.js");

            // kick
            if (reaction[0]?.type === 'kick') {
                if (interaction.customId === "kickdeny") {
                    const modal = new ModalBuilder()
                        .setCustomId('kickmodal')
                        .setTitle('Reason')


                    const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                        .setCustomId("kickfield")
                        .setLabel("Reason")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),);
                    modal.addComponents([field]);
                    return await interaction.showModal(modal);


                }


                if (interaction.customId === "kickaccept") {


                    await interaction.reply({
                        content: 'Accepted!', ephemeral: true
                    });
                    await interaction.message.delete();
                    const EmbedTitle = "You have been kicked";
                    const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please open a ticket.*`;
                    const EmbedColor = "#ff6767";

                    let embed = new EmbedBuilder({
                        title: EmbedTitle,
                        description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                        footer: {
                            text: guild.name, icon_url: guild.iconURL({dynamic: true})
                        }
                    }).setColor(EmbedColor ? EmbedColor : "Blurple")

                    user.send({embeds: [embed]})
                        .catch(() => {
                            console.log(`❌: Cant send message to <@${kickrequest.memberid}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${kickrequest.memberid}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.editReply({embeds: [embed], ephemeral: true});
                        })

                    await kickmember.kick(reason);
                    console.log(`✅: Successfully kicked ${user.tag} for ${reason}`)

                }
            }

            // warn

            if (reaction[0].type === 'warn') {
                console.log("2")
                if (interaction.customId === "warndeny") {
                    const modal = new ModalBuilder()
                        .setCustomId('warnmodal')
                        .setTitle('Reason')


                    const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                        .setCustomId("warnfield")
                        .setLabel("Reason")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),);
                    modal.addComponents([field]);
                    return await interaction.showModal(modal);


                }

                if (interaction.customId === "warnaccept") {
                    await interaction.reply({
                        content: 'Accepted!', ephemeral: true
                    });
                    await interaction.message.delete();
                    const EmbedTitle = "You have been warned";
                    const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please contact the head staff.*`;
                    const EmbedColor = "#ff6767";

                    let embed = new EmbedBuilder({
                        title: EmbedTitle,
                        description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                        footer: {
                            text: guild.name, icon_url: guild.iconURL({dynamic: true})
                        }
                    }).setColor(EmbedColor ? EmbedColor : "Blurple")

                    user.send({embeds: [embed]})
                        .catch(() => {
                            console.log(`❌: Cant send message to <@${warnrequest.memberid}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${warnrequest.memberid}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.editReply({embeds: [embed], ephemeral: true});
                        })

                    let warns = await client.db.getData('/warns/');

                    warns.push({
                        userId: user.id,
                        reason: reason,
                        guildId: interaction.guild.id,
                        warnerId: interaction.member.id,
                        time: Math.round(Date.now() / 1000), // create timestamp
                    });
                    await client.db.push('/warns/', warns)
                    await interaction.editReply({
                        content: `✅: Successfully warned <@${user.id}> for ${reason}`, ephemeral: true
                    });
                    console.log(`✅: Successfully warned ${user.tag} for ${reason}`)

                }
            }

            // ban


            if (reaction[0].type === 'ban') {
                if (interaction.customId === 'bandeny') {
                    const modal = new ModalBuilder()
                        .setCustomId("banmodal")
                        .setTitle("Reason");

                    const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                        .setCustomId("banfield")
                        .setLabel("Reason")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),);
                    modal.addComponents([field]);
                    return await interaction.showModal(modal);
                }

                if (interaction.customId === 'banaccept') {
                    await interaction.reply({
                        content: 'Accepted!', ephemeral: true
                    });
                    await interaction.message.delete();
                    const EmbedTitle = "You Have been Banned!";
                    const EmbedDescription = `By: <@${user.Id}> \nReason: **${reason}**\nIf you want to get unbaned follow this link : ${config.banlink}`;
                    const EmbedColor = "#FF0000";

                    let embed = new EmbedBuilder({
                        title: EmbedTitle,
                        description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                        footer: {
                            text: guild.name, icon_url: guild.iconURL({dynamic: true})
                        }
                    }).setColor(EmbedColor ? EmbedColor : "Blurple")

                    user.send({embeds: [embed]}).catch((err) => {
                        console.log(`❌: Cant DM ${user.tag} (probably disable his DM)`);
                        console.log(err)
                    })
                    console.log(`✅: Embed Send to ${user.tag}, now waiting for the ban... `);


                    await banmember.ban({reason: banrequest.reason})
                        .catch(() => {
                            console.log(`❌: Cant ban ${banmember.user.tag} (Permission missing)`)

                            interaction.editReply({
                                content: `❌: Cant ban ${banmember.user.tag} (Permission missing)`, ephemeral: true
                            })
                        })
                }
            }
        }
    }


})