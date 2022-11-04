const { EmbedBuilder, PermissionsBitField } = require('discord.js');



module.exports = {
    name: "listwarn", // Name of command
    description: "get the list of warn", // Command description
    type: 1, // Command type
    options: [

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
            let warns = await client.db.getData('/')
            console.log(warns)








        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
