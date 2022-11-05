const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "warn", // Name of command
    description: "Warn an user", // Command description
    type: 1, // Command type
    options: [
        {
            type: 6, // USER (MentionableUser)
            name: "user",
            description: "user to warn",
            required: true
        },
        {
            type: 3, // String
            name: "reason",
            description: "reason for the warn",
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
    run: async (client, interaction, config, db) => {
        try{
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;

            const user = options.getUser('user');
            const reason = options.getString('reason');
            const guild = interaction.guild.id;

            let warns = await client.db.getData('/warns/');

            warns.push({
                    userId: user.id,
                    reason: reason,
                    guildId: guild,
                    warnerId: interaction.member.id,
                    time: Math.round(Date.now() / 1000),
                    // create timestamp
                });
            await client.db.push('/warns/',warns)
            interaction.reply({ content:`✅: Successfully warned <@${user.id}> for ${reason}`, ephemeral: true});
            console.log(`✅: Successfully warned ${user.tag} for ${reason}`)

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
