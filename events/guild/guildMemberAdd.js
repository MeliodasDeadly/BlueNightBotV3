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
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
})