const { EmbedBuilder, PermissionsBitField, MessageEmbed, ButtonStyle, ButtonComponent, ActionRowBuilder, ButtonBuilder} = require('discord.js');
const Discord = require("discord.js");
const Cconfig = require("../../../botconfig/channel.json");

module.exports = {
    name: "warnrequest", // Name of command
    description: "Request a Warn", // Command description
    type: 1, // Command type
    options: [

        {
            type: 6, // USER (MentionableUser)
            name: "user",
            description: "User to warn",
            required: true
        },
        {
            type: 3, // String
            name: "reason",
            description: "Reason for warn",
            required: true
        },
        {
            type: 4, // NUMBER (0 to X)
            name: "force",
            description: "Force warn user",
            required: true
        }

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ManageMessages // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [
        '1037436624004464700'
    ],
    run: async (client, interaction, config, db) => {
        try{
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;

            let user = options.getUser("user");
            const userid = user.id;
            let reason = options.getString("reason");
            let force = options.getInteger("force");

            const { guild } = member;

            const EmbedTitle = "Warn Request";
            const EmbedDescription = "For: " + `<@${user.id}>` + "\nReason: **" + reason + "**\n Force: " + "**"+force+"**" + "\nRequested by: " + `<@${member.user.id}>`;
            const EmbedColor = "#ff4444";
            const ChannelOption = Cconfig.warnid;
            const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(ChannelOption);


            let embed = new EmbedBuilder({
                title:
                    String(EmbedTitle).substr(0, 256),
                description:
                    String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                footer: {
                    text: guild.name,
                    icon_url: guild.iconURL({dynamic: true})
                }
            })
                .setColor(EmbedColor ? EmbedColor : "BLURPLE")

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('warnaccept')
                        .setLabel('✓'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('warndeny')
                        .setLabel('X'),
                )
            await channel.send({
                embeds: [embed],
                components: [row]
            }).catch(err => {
                console.log(err)
            })
            let request = await client.db.getData('/request/');
            const guildid = interaction.guild.id;
            const message = channel.messages.cache.map(message => message.id)
            const messagecontent = message.toString().replace(/[]/g, " ");


            request.push({
                mode: "request",
                type: "warn",
                user: user.tag,
                userId: userid,
                member: member,
                memberid: member.user.id,
                reason: reason,
                force : force,
                messageId: messagecontent,
                guildId: guildid,
                modId: interaction.member.id,
                time: Math.round(Date.now() / 1000),
            });
            await client.db.push('/request/',request)
            console.log(`✅: Successfully added ${user.tag} to the database.`)

            interaction.reply({content: "✅: Request sent !", ephemeral: true});
            console.log(`✅: Embed Send to ${channel.name}!`);


        } catch (e) {
            console.log(String(e.stack).bgRed)
            interaction.reply({content: e, ephemeral: true})
        }

    },
};
