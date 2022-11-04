const client = require("../../index");
const settings = require("../../config/config.js")
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = { 
    name: 'guildMemberAdd'
};
client.on("guildMemberAdd", async member => {
    try {
        //get the welcome channel
        let channel = member.guild.channels.cache.get(settings.welcomechannel);
        //if no channel return error
        if (!channel) return;
        //get the welcome message
        let message = settings.welcomemessage;
        //if no message return error
        if (!message) return;
        //replace the placeholders
        message = message.replace(/{user}/g, member.user.tag).replace(/{size}/g, member.guild.memberCount);
        //send the welcome message
        channel.send(message);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
})