const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = {
    name: "kick", // Name of command
    description: "kick a member", // Command description
    type: 1, // Command type
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to ban",
            required: true
        },
        {
            type: 3,
            name: "reason",
            description: "The reason for the ban",
            required: true
        },
    ], // Command options
    cooldown: 5,
    permissions: {
        //DEFAULT_PERMISSIONS: PermissionsBitField.Flags.BanMembers, // Client permissions needed
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.BanMembers // User permissions needed
    },
    alloweduserids: [],
    requiredroles: [],

    run: async (client, interaction, config, db) => {

        try {

            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;

            let reason = options.getString("reason");
            let user = options.getMember("user");

            const { guild } = member;

            const EmbedTitle = "You Have been Kicked!";
            const EmbedDescription = `By: <@${member.user.id}> \nReason: **${reason}**\n*If you want to contest this kick, please open a ticket.*`;
            const EmbedColor = "#FF0000";

            let embed = new EmbedBuilder(
                {
                    title: EmbedTitle,
                    description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true })
                    }
                }
            ).setColor(EmbedColor ? EmbedColor : "Blurple")

            user.send({ embeds: [embed] }).catch((err) => {
                console.log(`❌: Cant DM ${user.user.tag} (probably disable his DM)`);
            })
            console.log(`✅: Embed Send to ${user.user.tag}, now waiting for the kick... `);


            await user.kick({reason}).catch((err) => {
                console.log(`❌: Cant kick ${user.user.tag} (Permission missing)`)
                throw `❌: Cant kick <@${user.user.id}> (Permission missing)`
            })
            interaction.editReply({ content: `✅: Successfully kicked ${user.user.tag} for ${reason}`, ephemeral: true })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            return interaction.reply({ content: e , ephemeral: true })
        }

        // execute
    },
};