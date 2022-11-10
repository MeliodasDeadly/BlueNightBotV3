const client = require("../../index");
const settings = require("../../config/config.js")
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js");
const {EmbedBuilder} = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'ModalSubmit',
};
client.on("interactionCreate", async interaction => {
    if (interaction.isModalSubmit()) {

        // kick
        if (interaction.customId === "kickmodal") {
            const kickrequest = client.kickRequest.get(interaction.message?.id);
            await interaction.message.delete();
            const reason = interaction.fields.getTextInputValue("kickfield");
            const EmbedTitle = "Your kick request has been denied";
            const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please contact the head staff.*`;
            const EmbedColor = "#ff6767";

            let embed = new EmbedBuilder({
                title: EmbedTitle,
                description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                footer: {
                    text: interaction.guild.name,
                    icon_url: interaction.guild.iconURL()
                }
            }).setColor(EmbedColor ? EmbedColor : "Blurple").setTimestamp();

            await kickrequest.member.send({embeds: [embed]}).catch(() => {
                console.log(`❌: Cant send message to <@${kickrequest.member.user.id}> (Probably disable his DM)`);
                let embed = new EmbedBuilder()
                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${kickrequest.member.user.id}> (Probably disable his DM)`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true});

            })
            interaction.reply({
                content: `✅: Message sent to : <@${kickrequest.member.user.id}>!`,
                ephemeral: true
            });
            console.log(`✅: Embed Send to ${kickrequest.member.user.tag}`);
        }


        // warn

        if (interaction.customId === "warnmodal") {
            const warnrequest = client.warnRequest.get(interaction.message?.id);
            await interaction.message.delete();
            const reason = interaction.fields.getTextInputValue("warnfield");
            const EmbedTitle = "Your warn request has been denied";
            const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please contact the head staff.*`;
            const EmbedColor = "#ff6767";

            let embed = new EmbedBuilder({
                title: EmbedTitle,
                description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                footer: {
                    text: interaction.guild.name,
                    icon_url: interaction.guild.iconURL()
                }
            }).setColor(EmbedColor ? EmbedColor : "Blurple").setTimestamp();

            await warnrequest.member.send({embeds: [embed]}).catch(() => {
                console.log(`❌: Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`);
                let embed = new EmbedBuilder()
                    .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true});

            })
            interaction.reply({
                content: `✅: Message sent to : <@${warnrequest.member.user.id}>!`,
                ephemeral: true
            });
            console.log(`✅: Embed Send to ${warnrequest.member.user.tag}`);


        }

        // ban

        if (interaction.customId === "banmodal") {

            const banrequest = client.banRequest.get(interaction.message?.id);
            await interaction.message.delete();
            const reason = interaction.fields.getTextInputValue("banfield");
            const EmbedTitle = "Your ban request has been denied";
            const EmbedColor = "#ff6767";
            const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please contact the head staff.*`;

            let embed = new EmbedBuilder(
                {
                    title: EmbedTitle,
                    description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                    footer: {
                        text: interaction.guild.name,
                        icon_url: interaction.guild.iconURL({dynamic: true})
                    }
                }).setColor(EmbedColor ? EmbedColor : "Blurple").setTimestamp();

            await banrequest.member.send({embeds: [embed]})
                .catch(() => {
                    console.log(`❌: Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`);
                    let embed = new EmbedBuilder()
                        .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`)
                        .setColor('Red')
                    interaction.reply({embeds: [embed], ephemeral: true});
                })
            interaction.reply({
                content: `✅: Message sent to : <@${banrequest.member.user.id}>!`,
                ephemeral: true
            });
            console.log(`✅: Embed Send to ${banrequest.member.user.tag}`);
        }

    }

})