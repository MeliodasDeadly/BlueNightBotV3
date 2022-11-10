const client = require("../../index");
const {EmbedBuilder, ModalBuilder} = require("discord.js");
const config = require("../../config/config");
module.exports = {
    name: 'ChatInputCommand',
};
client.on("interactionCreate", async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = client.slash_commands.get(interaction.commandName);
        //console.log(command)

        if (!command) return;

        tools.createLog(
            interaction,
            '1037799729817473034',
            `__Command Name :__ \n **${command.name}**\n __Command Channel :__ \n**<#${interaction.channel.id}>**`,
            `<@${interaction.user.id}>`,
            interaction.user.username,
            interaction.user.displayAvatarURL());


        //    console.log(interaction.options)
        // make requiredroleid

        const option = interaction?.options?.getSubcommand(false) || false;
        //console.log(option)
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`❌: You are not allowed to use this command!`)
                        .setColor('Red')
                ],
                ephemeral: true
            })
        }
        if (command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`❌: You are not allowed to use this command!`)
                        .setColor('Red')
                ],
                ephemeral: true
            })
        }
        if (option) {
            // get the option index from the command
            const optionIndex = command.options.findIndex((o) => o.name === option);

            if (tools.checkCooldown(interaction, command.options[optionIndex])) {
                return interaction.reply({
                    content: `❌: Please wait for re-use this command \`/${interaction.commandName} ${option}\``,
                    ephemeral: true
                });
            }

            return await command.run(client, interaction, config);
        }

        if (tools.checkCooldown(interaction, command)) {
            let embed = new EmbedBuilder()
                .setDescription(`<:redcross:1038240381143363585> : Please wait before reusing this command \`/${interaction.commandName}\``)
                .setColor('Red')
            return interaction.reply({embeds: [embed], ephemeral: true});
        }

        return await command.run(client, interaction, config);

    }

})