const { MessageEmbed, Message, GuildMember } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const sheetconfig = require('../../botconfig/sheet.json');
const bluenight = require('../../botconfig/bluenight.json');
const { time } = require("@discordjs/builders");
// import discord guild
module.exports = {
  name: "ban", //the command name for the Slash Command
  description: "ban a user", //the command description for Slash Command Overview
  cooldown: 5, // Number (in seconds) of how long the cooldown for this command should be
  memberpermissions: ["BAN_MEMBERS"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {"User": { name: "user", description: "Which user i have to ban ?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
    {"StringChoices": { name: "deletetime", description: "How many Message did you want to delete ?", required: true, choices: [["5minute", "5min"], ["1day", "1day"], ["1Week", "1week"]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("")
    {"String": { name: "reason", description: "What is the reason for the ban ?", required: false }}, //to use in the code: interacton.getString("title")
		//{"String": { name: "description", description: "What should be the Embed Description? [ +n+ = NewLine ]", required: true }}, //to use in the code: interacton.getString("description")
		//{"String": { name: "color", description: "What should be the Embed Color?", required: false }}, //to use in the code: interacton.getString("color")
		//{"Channel": { name: "what_channel", description: "Which Channel I will clone", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		
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

    let reason = options.getString("reason");
    let user = options.getUser("user");
    let userid = user.id;

    if (!reason) reason = "No reason given";
    if (!user) return interaction.reply({content : `You need to mention the user you want to ban!`, ephemeral: true});

    const { guild } = member;

		const EmbedTitle = "You Have been Banned!"; 
		const EmbedDescription = "By: " + member.user.tag + "\nReason: **" + reason + "**\nIf you want to get unbaned follow this link : " + config.banlink; 
		const EmbedColor = "#FF0000"; 

    const StringOption = options.getString("deletetime");

    let timedelete = {deleteMessageSeconds: 60 * 60 * 24 * 7, reason};

    if(StringOption == "5min"){timedelete = {deleteMessageSeconds: 60*5}}
    if(StringOption == "1day"){timedelete = {deleteMessageSeconds: 86400}}
    if(StringOption == "1week"){timedelete = {deleteMessageSeconds: 86400*7}}

    let embed = new MessageEmbed().setColor(EmbedColor ? EmbedColor : "BLURPLE")

		.setTitle(String(EmbedTitle).substr(0, 256))

		.setDescription(String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"))

		.setFooter(guild.name, guild.iconURL({dynamic: true}));

		await user.send({embeds: [embed]}).catch((err) => {
      console.log(`❌: Cant DM ${user.tag} (probably disable his DM)`); 
    }).then(() => {
       console.log(`✅: Embed Send to ${user.tag}, now waiting for the ban... `);
    });
    
    guild.members.ban(userid, timedelete, reason).catch((err) => {
    console.log(`❌: Cant ban ${user.tag} (Permission missing)`)})
      .then(() => {interaction.reply({content: `✅: Successfully banned ${user.tag} for ${reason}`, ephemeral: true}).catch( (err) => {console.log(`✅: Aborted reply`)})});

  
  const doc = new GoogleSpreadsheet(sheetconfig.Sheetid);

    await doc.useServiceAccountAuth({
      client_email: bluenight.client_email,
      private_key: bluenight.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      'User': user.tag,
      'UserID': user.id,
      'Reason': reason,
      'Date': new Date().toLocaleString(),
      'Moderator': member.tag,
      'ModeratorID': member.id,
    })
    .catch((err) => {
      
      console.log(`❌: Error when adding ${user.tag} to the Google Sheet!`)
      console.log(String(err.stack).bgRed)

    })
    .then(() => {console.log(`✅: Successfully added ${user.tag} to the Google Sheet!`)});
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}
