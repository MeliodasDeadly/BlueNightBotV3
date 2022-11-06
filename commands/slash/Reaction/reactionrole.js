const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, SelectMenuBuilder} = require('discord.js');

module.exports = {
    name: "reactionrole", // Name of command
    description: "send a Message and give a role when react.", // Command description
    type: 1, // Command type
    options: [
        {
            type: 7, // CHANNEL (MentionableChannel)
            name: "channel",
            description: "The channel to send the Message",
            required: true
        },
        {
            type: 8, // ROLE (MentionableRole)
            name: "role",
            description: "The role to give",
            required: true
        },
        {
            type: 8, // ROLE (MentionableRole)
            name: "role2",
            description: "The 2nd role to give",
            required: false
        },
        {
            type: 8, // ROLE (MentionableRole)
            name: "role3",
            description: "The 3rd role to give",
            required: false
        },

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.Administrator // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        try {
            const {
                member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const role = options.getRole("role");
            const role2 = options.getRole("role2");
            const role3 = options.getRole("role3");
            const channel = options.getChannel("channel");
            const messageid = interaction.id;



            const embed = new EmbedBuilder({
                title: "Reaction Role",
                description: 'Open the menu and select the role you want to get',
                footer: {
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({dynamic: true})
                }

            })
                .setColor("Green")
                .setTimestamp();

            let role2id
            let role3id
            switch (role2) {
                case undefined:
                    role2id = "none"
                    break;
                default:
                    role2id = role2.id
                    break;
                case null:
                    role2id = "none"
                    break;
            }
            switch (role3) {
                case undefined:
                    role3id = "none"
                    break;
                default:
                    role3id = role3.id
                    break;
                case null:
                    role3id = "none"
                    break;
            }
            let row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId(messageid)
                        .setPlaceholder('Nothing selected')
                        .addOptions([
                            {
                                label: role.name,
                                value: role.id + interaction.guild.id,
                            },
                        ])
                );

            if (role2 && !role3) {
                row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId(messageid)
                            .setPlaceholder('Nothing selected')
                            .setMinValues(1)
                            .setMaxValues(2)
                            .addOptions([
                                {
                                    label: role.name,
                                    value: role.id + interaction.guild.id,
                                },
                                {
                                    label: role2.name,
                                    value: role2.id + interaction.guild.id,
                                },
                            ]),
                    );

            }
            if (role2 && role3) {
                row =
                    new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId(messageid)
                                .setPlaceholder('Nothing selected')
                                .setMinValues(1)
                                .setMaxValues(3)
                                .addOptions([
                                    {
                                        label: role.name,
                                        value: role.id + interaction.guild.id,
                                    },
                                    {
                                        label: role2.name,
                                        value: role2.id + interaction.guild.id,
                                    },
                                    {
                                        label: role3.name,
                                        value: role3.id + interaction.guild.id,
                                    },
                                ]),
                        );
            }
            await channel.send({embeds: [embed], components: [row]});
            interaction.reply({ content :"✅: Message sent", ephemeral: true });
            // get message sent by the bot
            const message = channel.messages.cache.map(message => message.id)



            /*let messageid2 = await client.db.getData('/messageid');
            messageid2.push({
                messageId: message,
            })
            await client.db.push('/messageid/', messageid2);
            console.log('✅: Successfully added messageid to the database');
*/
            let reactionid = await client.db.getData('/reactionid/');
            //console.log(message)



            reactionid.push({
                roleID: role.id,
                roleId2: role2id,
                roleId3: role3id,
                messageId: message,
                channelID: channel.id,
                guildID: interaction.guild.id,
                time: Math.round(Date.now() / 1000),
            });
            await client.db.push('/reactionid/', reactionid);
            console.log('✅: Successfully added reactionrole to the database');


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
