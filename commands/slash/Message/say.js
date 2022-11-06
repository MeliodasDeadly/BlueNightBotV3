const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "say", // Name of command
    description: "Say Message with the bot", // Command description
    type: 1, // Command type
    options: [
        {
            type: 3, // String
            name: "message",
            description: "Message to send (+n+ for new line)",
            required: true
        },
        {
            // channel
            type: 7,
            name: "channel",
            description: "Channel to send the Message to",
            required: false
        }

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
            } = interaction

            const { guild } = member;
            const Text = options.getString("message"); //same as in StringChoices //RETURNS STRING
            const ChannelOption = options.getChannel("channel"); //RETURNS CHANNEL OBJECt

            const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);
            //update it without a response!
            await interaction.reply({content: `Sending the Message...`, ephemeral: true});
            //SEND THE EMBED!
            await channel.send({content: String(Text).substr(0, 2000).split("+n+").join("\n")});
            //Edit the reply
            interaction.editReply({content: `✅: Message sent!`, ephemeral: true});



        } catch (e) {
            console.log(e)
        }

    },
};