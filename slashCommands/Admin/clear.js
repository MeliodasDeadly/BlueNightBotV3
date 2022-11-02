const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
// import discord guild
module.exports = {
  name: "clear", //the command name for the Slash Command
  description: "clear some message", //the command description for Slash Command Overview
  cooldown: 5,// Number (in seconds) of how long the cooldown for this command should be
  memberpermissions: ["MANAGE_MESSAGES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		{"Integer": { name: "amount", description: "How many message did you want to clear ?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{"String": { name: "title", description: "What should be the Embed title?", required: true }}, //to use in the code: interacton.getString("title")
		//{"String": { name: "description", description: "What should be the Embed Description? [ +n+ = NewLine ]", required: true }}, //to use in the code: interacton.getString("description")
		//{"String": { name: "color", description: "What should be the Embed Color?", required: false }}, //to use in the code: interacton.getString("color")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		{"Channel": { name: "what_channel", description: "What channel ?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
	
  ],
  run: async (client, interaction) => {
    try{
	    //console.log(interaction, StringOption)

		
		//things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 

        let ChannelOption = options.getChannel("what_channel");
        let amount = options.getInteger("amount");

        if (!ChannelOption) ChannelOption = interaction.channel;
        const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);

        
        channel.bulkDelete(amount, true).then(interaction.reply({ content: `Cleared ${amount} messages.`, ephemeral: true })).catch(err => {});


        


	
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}
