const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "unban", // Name of command
    description: "unban a player", // Command description
    type: 1, // Command type
    options: [
        {
            type: 3,
            name: "uid",
            description: "The user to unban (UID only)",
            required: true
        }

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.BanMembers // User permissions needed | Use PermissionsBitField.Flags.
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

            const { guild } = interaction;
            const uid = options.getString("uid");
            const user = await client.users.fetch(uid);

            await guild.members.unban(user).catch((err) => {
                throw `❌: not unbanned ${user.tag}, are you sure his banned ?`;
                console.log(`❌: not unbanned ${user.tag}`);
            });
            interaction.reply({
                content : `✅: Unbanned ${user.tag}`, ephemeral: true
            });
            console.log(`✅: Unbanned ${user.tag}`);

        } catch (e) {
            console.log(String(e.stack).bgRed)
            interaction.reply({
               content: e , ephemeral: true
            });
        }
    },
};
