const client = require("../../index");
const settings = require("../../config/config.js")
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'SelectMenu',
};
client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        const selected = interaction.values.join(', ');

        if( interaction.customId === 'reactionrole') {
            let reaction = await client.db.getData('/reactionid/')
            reaction = reaction.filter(reaction => reaction.guildID === interaction.guild.id && reaction.messageId === interaction.message.id)
            let role = interaction.guild.roles.cache.get(selected);
            if (interaction.guild.id === reaction[0].guildID && interaction.message.id === reaction[0].messageId) {
                await interaction.member.roles.add(role);
                interaction.reply({content: `✅: You have been added to the role <@&${role.id}>`, ephemeral: true})
            } else {
                interaction.reply({content: `❌: You are not allowed to use this command!`, ephemeral: true})
                console.log(`❌: ReactionMessage Error, Channel : ${interaction.channel.id}, Guild : ${interaction.guild.id}, user : ${interaction.user.id}`)
            }
        }

    }

})