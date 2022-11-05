const { EmbedBuilder, PermissionsBitField } = require('discord.js');



module.exports = {
    name: "listwarn", // Name of command
    description: "get the list of warn", // Command description
    type: 1, // Command type
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to get the list of warn",
            required: true
        }

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ManageMessages // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: ['1037436624004464700'],
    run: async (client, interaction, config) => {
        try{
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const user = options.getUser('user');
            //await client.db.push("/test1","super test");
            await client.db.save()
            await client.db.reload()
            let warns = await client.db.getData('/warns/')

            warns = warns.filter(warn => warn.guildId === interaction.guild.id)
            warnsuser = warns.filter(warn => warn.userId === user.id)

            if (!user){

            let warnlist = warns.map(warn => `\n <------------- Warn Date : <t:${warn.time}:t> ------------->\n \n __User__ : <@${warn.userId}> \n __Reason__ : ${warn.reason} \n __Moderator__ :  <@${warn.warnerId}>`).join("\n")

            let embed = new EmbedBuilder({
                description: warnlist,
                footer:{
                    text: interaction.guild.name,
                    icon_url: interaction.guild.iconURL({Dynamic: true})
                },
            })
                .setThumbnail(interaction.guild.iconURL())
                .setColor("Green")
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true});

            } else if (warnsuser.length <= 0) {
                let embed = new EmbedBuilder()
                    .setDescription(`<:redcross:1038240381143363585> : No warn found for <@${user.id}>`)
                    .setColor('Red')
                interaction.reply({ embeds: [embed], ephemeral: true});
            }else {



                    let warnlist = warnsuser.map(warnuser => `\n <------------- Warn Date : <t:${warnuser.time}:t> ------------->\n \n __User__ : <@${warnuser.userId}> \n __Reason__ : ${warnuser.reason} \n __Moderator__ :  <@${warnuser.warnerId}>`).join("\n")

                    let embed = new EmbedBuilder({
                        description: warnlist,
                        footer:{
                            text: interaction.guild.name,
                            icon_url: interaction.guild.iconURL({Dynamic: true})
                        },
                    })
                        .setThumbnail(interaction.guild.iconURL())
                        .setColor("Green")
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed], ephemeral: true});
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
