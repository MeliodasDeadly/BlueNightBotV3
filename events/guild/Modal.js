const client = require("../../index");
const {EmbedBuilder} = require("discord.js");
const ms = require("ms"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'ModalSubmit',
};
client.on("interactionCreate", async interaction => {
        if (interaction.isModalSubmit()) {
            let reaction = await client.db.getData('/report/')
            const channel = client.channels.cache.get('1037412341647691886');

            const thread = channel.threads.cache.map(thread => thread.id)
            const threadcontent = thread.toString().replace(/[]/g, " ");
            reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.threadId === threadcontent)
            if (reaction.length > 0) {
                const reported = await interaction.guild.members.fetch(reaction[0].userId);

                let warns = await client.db.getData('/warns/');
                const guild = interaction.guild.id;

                if (interaction.customId) {
                    const user = await interaction.guild.members.fetch(reaction[0].memberId);
                    switch (interaction.customId) {
                        case "memberbanmodal" :
                            const banreason = interaction.fields.getTextInputValue("banfield");


                            const EmbedTitle = "Your have been banned";
                            const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${banreason}** \n*If you want to contest this, please contact the head staff.*`;
                            const EmbedColor = "#ff6767";
                            const embed = new EmbedBuilder()
                                .setTitle(EmbedTitle)
                                .setDescription(String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"))
                                .setFooter({
                                    text: interaction.guild.name,
                                    iconURL: interaction.guild.iconURL()
                                })
                                .setColor(EmbedColor ? EmbedColor : "Blurple")
                                .setTimestamp()
                            await user.user.send({
                                embeds: [embed]
                            }).catch(() => {
                                console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                                let embed = new EmbedBuilder()
                                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                    .setColor('Red')
                                interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                            }).then(() => {

                            })
                            await user.ban({
                                reason: banreason
                            }).then(() => {
                                interaction.reply({
                                    content: `✅: <@${reaction[0].memberId}> has been banned!`,
                                    ephemeral: true
                                })
                            })
                            break;
                        case "memberkickmodal" :
                            const kickreason = interaction.fields.getTextInputValue("kickfield");


                            const kickembed = new EmbedBuilder()
                                .setTitle("Your have been kicked")
                                .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${kickreason}** \n*If you want to contest this, please contact the head staff.*`)
                                .setFooter({
                                    text: interaction.guild.name,
                                    iconURL: interaction.guild.iconURL()
                                })
                                .setColor("#ff6767")
                                .setTimestamp()
                            await user.user.send({
                                embeds: [kickembed]

                            }).catch(() => {
                                console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                                let embed = new EmbedBuilder()
                                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                    .setColor('Red')
                                interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                            }).then(() => {

                            })
                            await user.kick({
                                reason: kickreason
                            }).then(() => {
                                interaction.reply({
                                    content: `✅: <@${reaction[0].memberId}> has been kicked!`,
                                    ephemeral: true
                                })
                            })
                            break;
                        case "memberwarnmodal" :
                            const warnreason = interaction.fields.getTextInputValue("warnfield");
                            const warnembed = new EmbedBuilder()
                                .setTitle("Your have been warned")
                                .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${warnreason}** \n*If you want to contest this, please contact the head staff.*`)
                                .setFooter({
                                    text: interaction.guild.name,
                                    iconURL: interaction.guild.iconURL()
                                })
                                .setColor("#ff6767")
                                .setTimestamp()
                            await user.user.send({
                                embeds: [warnembed]
                            }).catch(() => {
                                console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                                let embed = new EmbedBuilder()
                                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                    .setColor('Red')
                                interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });
                            }).then(() => {

                            })


                            warns.push({
                                userId: user.user.id,
                                reason: warnreason,
                                guildId: guild,
                                warnerId: interaction.member.user.id,
                                time: Math.round(Date.now() / 1000),
                            });
                            await client.db.push('/warns/', warns)
                            interaction.reply({
                                content: `✅: Successfully warned <@${user.user.id}> for ${warnreason}`,
                                ephemeral: true
                            });
                            console.log(`✅: Successfully warned ${user.user.tag} for ${warnreason}`)
                            break;
                        case "membertbm" :
                            const tempbanreason = interaction.fields.getTextInputValue("tempbanfield");
                            const tempbanembed = new EmbedBuilder()
                                .setTitle("Your have been temporary banned")
                                .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${tempbanreason}** \n*If you want to contest this, please contact the head staff.*`)
                                .setFooter({
                                    text: interaction.guild.name,
                                    iconURL: interaction.guild.iconURL()
                                })
                                .setColor("#ff6767")
                                .setTimestamp()
                            await user.user.send({
                                embeds: [tempbanembed]
                            }).catch(() => {
                                console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                                let embed = new EmbedBuilder()
                                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                    .setColor('Red')
                                interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                            })
                            const timeout = interaction.fields.getTextInputValue("tempbantime")
                            // transform the timeout into milliseconds
                            const time = ms(timeout);
                            // check if timeout is a number or not

                            await user.timeout(time, tempbanreason
                            ).then(() => {
                                interaction.reply({
                                    content: `✅: <@${reaction[0].memberId}> has been temporary banned!`,
                                    ephemeral: true
                                })
                            })
                            break;
                    }
                }
                const user = await interaction.guild.members.fetch(reaction.memberId);
                switch (interaction.customId) {
                    case "reportbanmodal" :
                        const banreason = interaction.fields.getTextInputValue("banfield");
                        const banreportedembed = new EmbedBuilder()
                            .setTitle("Your have been banned")
                            .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${banreason}** \n*If you want to be unbanned, please follow this link: ${config.banlink}`)
                            .setFooter({
                                text: interaction.guild.name,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setColor("#ff6767")
                            .setTimestamp()
                        await user.user.send({
                            embeds: [banreportedembed]
                        }).catch(() => {
                            console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            });
                        }).then(() => {
                        })
                        await user.ban({
                            reason: banreason
                        }).then(() => {
                            interaction.reply({
                                content: `✅: <@${reaction[0].memberId}> has been banned!`,
                                ephemeral: true
                            })
                        })
                        break;
                    case "reportkickmodal" :
                        const kickreason = interaction.fields.getTextInputValue("kickfield");
                        const kickreportedembed = new EmbedBuilder()
                            .setTitle("Your have been kicked")
                            .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${kickreason}** \n*If you want to contest this, please contact the head staff.*`)
                            .setFooter({
                                text: interaction.guild.name,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setColor("#ff6767")
                            .setTimestamp()
                        await user.user.send({
                            embeds: [kickreportedembed]
                        }).catch(() => {
                            console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            });
                        }).then(() => {
                        })
                        await user.kick({
                            reason: kickreason

                        }).then(() => {
                            interaction.reply({
                                content: `✅: <@${reaction[0].memberId}> has been kicked!`,
                                ephemeral: true
                            })
                        })
                        break;
                    case "reportwarnmodal" :
                        const warnreason = interaction.fields.getTextInputValue("warnfield");
                        const warnreportedembed = new EmbedBuilder()
                            .setTitle("Your have been warned")
                            .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${warnreason}** \n*If you want to contest this, please contact the head staff.*`)
                            .setFooter({
                                text: interaction.guild.name,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setColor("#ff6767")
                            .setTimestamp()
                        await user.user.send({
                            embeds: [warnreportedembed]
                        }).catch(() => {
                            console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            });
                        }).then(() => {
                            interaction.reply({
                                content: `✅: Message sent to : <@${reaction[0].memberId}>!`,
                                ephemeral: true
                            });
                        })

                        warns.push({
                            userId: reported.user.id,
                            reason: warnreason,
                            guildId: guild,
                            warnerId: interaction.member.user.id,
                            time: Math.round(Date.now() / 1000),
                        });
                        await client.db.push('/warns/', warns)
                        interaction.reply({
                            content: `✅: Successfully warned <@${reported.user.id}> for ${warnreason}`,
                            ephemeral: true
                        });
                        console.log(`✅: Successfully warned ${reported.user.tag} for ${warnreason}`)

                        break;
                    case "reporttbm" :
                        const tempbanreason = interaction.fields.getTextInputValue("tempbanfield");
                        const tempbanreportedembed = new EmbedBuilder()
                            .setTitle("Your have been temporary banned")
                            .setDescription(`__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${tempbanreason}** \n*If you want to contest this, please contact the head staff.*`)
                            .setFooter({
                                text: interaction.guild.name,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setColor("#ff6767")
                            .setTimestamp()
                        await user.user.send({
                            embeds: [tempbanreportedembed]
                        }).catch(() => {
                            console.log(`❌: Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`);
                            let embed = new EmbedBuilder()
                                .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${reaction[0].memberId}> (Probably disable his DM)`)
                                .setColor('Red')
                            interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            });
                        }).then(() => {
                            interaction.reply({
                                content: `✅: Message sent to : <@${reaction[0].memberId}>!`,
                                ephemeral: true
                            });
                        })
                        const timeout = interaction.fields.getTextInputValue("tempbantime");
                        const time = ms(timeout);
                        await user.timeout(time, tempbanreason
                        ).then(() => {
                            interaction.reply({
                                content: `✅: <@${reaction[0].memberId}> has been temporary banned!`,
                                ephemeral: true
                            })
                        })

                        break;
                }
            }
        }
    }
);