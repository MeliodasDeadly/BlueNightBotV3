const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: "embed", // Name of command
    description: "Create an embed", // Command description
    type: 1, // Command type
    options: [
        {
            type: 3, // String
            name: "title",
            description: "Set Title",
            required: true
        },
        {
            type: 3, // String
            name: "description",
            description: "Set Description (+n+ for new line)",
            required: true
        },
        {
            type: 3, // String
            name: "color",
            description: "Set Color (In Hex format)",
            required: true
        },
        {
            type: 7, // CHANNEL (MentionableChannel)
            name: "channel",
            description: "Channel will send embed.",
            required: false
        }
    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.ManageGuild // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        const {
            member, channelId, guildId, applicationId,
            commandName, deferred, replied, ephemeral,
            options, id, createdTimestamp
        } = interaction;

        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const {
                member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const {guild} = member;
            const EmbedTitle = options.getString("title"); //same as in StringChoices //RETURNS STRING
            const EmbedDescription = options.getString("description"); //same as in StringChoices //RETURNS STRING
            const EmbedColor = options.getString("color"); //same as in StringChoices //RETURNS STRING
            let ChannelOption = options.getChannel("channel"); //RETURNS CHANNEL OBJECt
            if (!ChannelOption) ChannelOption = interaction.channel;
            const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);

            let embed = new EmbedBuilder(
                {
                    title: EmbedTitle,
                    description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true })
                    },
                    timestamp: new Date(),
                }
            ).setColor(EmbedColor ? EmbedColor : "Blurple")

            await interaction.reply({content: `Sending the Embed...`, ephemeral: true});
            //SEND THE EMBED!
            await channel.send({embeds: [embed]});
            //Edit the reply
            interaction.editReply({content: `✅: Embed sent!`, ephemeral: true});
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
}