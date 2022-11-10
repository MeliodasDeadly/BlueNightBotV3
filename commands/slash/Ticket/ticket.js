const {EmbedBuilder, PermissionsBitField, ButtonBuilder, ChannelType, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = {
    name: "ticket", // Name of command
    description: "Create a Ticket", // Command description
    type: 1, // Command type
    options: [
        {
            type: 3, // STRING
            name: "reason",
            description: "Add a reason",
            required: true
        },
        {
            type: 6, // USER (MentionableUser)
            name: "user",
            description: "Add a first User",
            required: true
        },

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ManageMessages // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: ['1037436624004464700'],
    run: async (client, interaction, config, db) => {
        try {
            const {
                member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            let user = options.getUser("user");
            let reason = options.getString("reason");
            const role = interaction.guild.roles.cache.get('1037436624004464700');
            // get categaory via id and create channel
            const category = interaction.guild.channels.cache.get('1040269960724881458');
            const channel = await interaction.guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                    {
                        id: role.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                    }
                ]
            });
            await channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });

            // send message
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`Ticket for ${user.username}`)
                .setDescription(`__Reason:__ \n **${reason}** \n __Ticket ID:__ \n**${channel.id}** \n \n*If you want to close this ticket, please click on the button.*`)
                .setFooter({
                    text:`Ticket created by ${member.user.username}`,
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
            interaction.reply({content: `Ticket created in ${channel}`, ephemeral: true});
            console.log("✅: Ticket created in " + channel.name);

            let tickets = await client.db.getData('/tickets/');
            const guildid = interaction.guild.id;
            const userid = user.id;
            const message = channel.messages.cache.map(message => message.id)
            const messagecontent = message.toString().replace(/[]/g, " ");


            tickets.push({
                mode: "tickets",
                type: "tickets",
                user: user.tag,
                userId: userid,
                memberId: member.user.id,
                messageId: messagecontent,
                guildId: guildid,
                modId: interaction.member.id,
                time: Math.round(Date.now() / 1000),
            });
            await client.db.push('/tickets/',tickets)
            console.log(`✅: Successfully added ${user.tag} to the database.`)

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
