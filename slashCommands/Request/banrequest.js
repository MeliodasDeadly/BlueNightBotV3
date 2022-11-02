const { MessageEmbed } = require("discord.js");
const Cconfig = require(`../botconfig/channel.json`);
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
// import discord guild
module.exports = {
  name: "banrequest", //the command name for the Slash Command
  description: "Request a ban", //the command description for Slash Command Overview
  cooldown: 5,// Number (in seconds) of how long the cooldown for this command should be
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['968983319675015188'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		
        {"User": { name: "user", description: "Name of user", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        {"String": { name: "reason", description: "What is the reason for this request ?", required: true }}, //to use in the code: interacton.getString("title")
        {"Integer": { name: "force", description: "What is the force for this request ?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "description", description: "What should be the Embed Description? [ +n+ = NewLine ]", required: true }}, //to use in the code: interacton.getString("description")
		//{"String": { name: "color", description: "What should be the Embed Color?", required: false }}, //to use in the code: interacton.getString("color")
		
		//{"Channel": { name: "what_channel", description: "Which Channel I will clone", required: false }}, //to use in the code: interacton.getChannel("what_channel")
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
        let user = options.getUser("user");
        const userid = user.id;
        let reason = options.getString("reason");
        let force = options.getInteger("force");
        let timedelete = {deleteMessageSeconds: 60 * 60 * 24 * 7, reason};

        const { guild } = member;
		
        
		const EmbedTitle = "Ban Request"; 
		const EmbedDescription = "For: " + user + "\nReason: " + reason + "\n Force" + force + "\nRequested by: " + member.user.tag; 
		const EmbedColor = "#FF0000"; 
	
		const ChannelOption = Cconfig.banid
        const ChannelID = Cconfig.banid
		const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);

    let embed = new MessageEmbed().setColor(EmbedColor ? EmbedColor : "BLURPLE")

		.setTitle(String(EmbedTitle).substr(0, 256))

		.setDescription(String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"))

		.setFooter(guild.name, guild.iconURL({dynamic: true}));

        // Create 2 buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('deny')
                    .setLabel('Deny')
                    .setStyle('DANGER'),
            );
            // get accept button
            client.on('interactionCreate', async interaction => {
                if (!interaction.isButton()) return;
                if (interaction.customId === 'accept') {
                    await interaction.reply({ content: 'Accepted!', ephemeral: true });
                    guild.members.ban(userid, timedelete, reason).catch((err) => {
                        console.log(`❌: Cant ban ${user.tag} (Permission missing)`)})
                          .then(() => {interaction.editReply({content: `✅: Successfully banned ${user.tag} for ${reason}`, ephemeral: true}).catch( (err) => {console.log(`✅: Aborted reply`)})});
                }})
            // get refuse button
            client.on('interactionCreate', async interaction => {
                if (!interaction.isButton()) return;
            
                if (interaction.customId === 'deny') {
                    await interaction.reply({ content: 'Denied!', ephemeral: true });
                    member.send(`Your ban request for ${user.tag} has been denied for ${reason}`).catch((err) => {
                        console.log(`❌: Cant send message to ${member.user.tag} (Permission missing)`)
                    })
                
                }
            });

		await ChannelID.send({embeds: [embed]}).catch((err) => {console.log(err)}
        ).then(() => {
        console.log(`✅: Embed Send to ${ChannelID.name}!`);
    });

        


	
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}
