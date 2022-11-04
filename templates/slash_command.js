const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "", // Name of command
    description: "", // Command description
    type: 1, // Command type
    options: [

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
    } = interaction; 
    },
};