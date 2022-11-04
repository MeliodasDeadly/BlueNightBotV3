const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "clear", // Name of command
    description: "clear some text", // Command description
    type: 1, // Command type
    options: [
        {
            type: 10, // NUMBER (0 to X)
            name: "amount",
            description: "Number of message to be cleared",
            required: true
        },
        {
            type: 7, // CHANNEL (MentionableChannel)
            name: "channel",
            description: "What channel have to be clear ? (default: current channel)",
            required: false
        },



    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ManageMessages // User permissions needed | Use PermissionsBitField.Flags.
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
   

        let ChannelOption = options.getChannel("channel");
        let amount = options.getNumber("amount");

        if (!ChannelOption) ChannelOption = interaction.channel;
        const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : interaction.guild.channels.cache.get(channelId);

        
        await channel.bulkDelete(amount, true).catch(err => {
            console.log(`❌: Failed to clear message on ${channel.name} (Amount : ${amount})`)
            throw `❌: Failed to clear message on ${channel.name} (Permission Missing)`
        });
        
        console.log(`✅: Cleared ${amount} messages. (Channel : ${channel.name})`)
        interaction.reply({ content: `✅: Cleared ${amount} messages on ${channel.name}.`, ephemeral: true })
        
            
       

        


	
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return interaction.reply(e)
    }
    
    },
};