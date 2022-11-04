const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");

module.exports = {
    name: "interactionCreate"
};

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.slash_commands.get(interaction.commandName);
        //console.log(command)

        if (!command) return;
        tools.createLog(interaction,'1037799729817473034', `__Command Name :__ \n **${command.name}**\n __Command Channel :__ \n**<#${interaction.channel.id}>**`, `<@${interaction.user.id}>`, interaction.user.username, interaction.user.displayAvatarURL());

        try {
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
            if(command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.user.id)){
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
                return interaction.reply({
                    content: `❌: Please wait for re-use this command \`/${interaction.commandName}\``,
                    ephemeral: true
                });
            }



            await command.run(client, interaction, config);
        } catch (e) {
            console.error(e)
        }
    }

});

