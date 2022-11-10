const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "gettag", // Name of command
    description: "Log Available Tag", // Command description
    type: 1, // Command type
    options: [

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.Administrator // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        try{
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const channel = client.channels.cache.get('1037412341647691886');

            console.log(channel.availableTags);

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
