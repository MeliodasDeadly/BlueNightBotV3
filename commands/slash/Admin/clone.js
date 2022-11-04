
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "clone", // Name of command
    description: "Clone a channel", // Command description
    type: 1, // Command type
    options: [
        {
            type: 7, // CHANNEL (MentionableChannel)
            name: "channel",
            description: "Channel will clone.",
            required: false
        },

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ManageChannels, // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;

            let ChannelOption = options.getChannel("channel");

            if (!ChannelOption) ChannelOption = interaction.channel;

            const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);

            await channel.clone().then((ch) => {
                console.log(`Successfully cloned ${channel}`);
                interaction.reply({ content: `Successfully forceclear ${channel}, this channel will be deleted in 2 seconds.`, ephemeral: true });
            }).catch((err) => {
                throw `❌: Cant clear ${channel} (Permission Missing)`
            })

//✅❌

        } catch (e) {
            console.log(String(e.stack).bgRed)
            return interaction.reply(e)
        }
    },
};