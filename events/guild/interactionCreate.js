const {EmbedBuilder,ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require("discord.js");
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
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        return await command.run(client, interaction, config);

    }
    if (interaction.isModalSubmit()) {

        // warn

        if(interaction.customId === "warnmodal"){
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
                interaction.reply({ embeds: [embed], ephemeral: true});

            })
            interaction.reply({
                content: `✅: Message sent to : <@${warnrequest.member.user.id}>!`,
                ephemeral: true });
            console.log(`✅: Embed Send to ${warnrequest.member.user.tag}`);


        }

        // ban

        if(interaction.customId === "banmodal"){

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
                        icon_url: interaction.guild.iconURL({ dynamic: true })
                    }
                }).setColor(EmbedColor ? EmbedColor : "Blurple").setTimestamp();

            await banrequest.member.send({ embeds: [embed] })
                .catch(() => {
                    console.log(`❌: Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`);
                    let embed = new EmbedBuilder()
                        .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${banrequest.member.user.id}> (Probably disable his DM)`)
                        .setColor('Red')
                    interaction.reply({ embeds: [embed], ephemeral: true});
                })
            interaction.reply({
                content: `✅: Message sent to : <@${banrequest.member.user.id}>!`,
                ephemeral: true });
            console.log(`✅: Embed Send to ${banrequest.member.user.tag}`);
        }

    }
    if (interaction.isButton()) {
        const banrequest = client.banRequest.get(interaction.message?.id);
        const warnrequest = client.warnRequest.get(interaction.message?.id);
        const banmember = await interaction.guild.members.fetch(banrequest?.userid);
        const warnmember = await interaction.guild.members.fetch(warnrequest?.userid);
        const {TextInputBuilder, ActionRowBuilder, TextInputStyle} = require("discord.js");

        // warn

        if(interaction.customId === "warndeny"){
            const modal = new ModalBuilder()
                .setCustomId('warnmodal')
                .setTitle('Reason')


            const field = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("warnfield")
                    .setLabel("Reason")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );
            modal.addComponents([field]);
            return await interaction.showModal(modal);


        }

        if(interaction.customId === "warnaccept"){
            const user = warnmember.user
            const guild = interaction.guild;
            const reason = warnrequest.reason;
            await interaction.reply({
                content: 'Accepted!',
                ephemeral: true
            });
            await interaction.message.delete();
            const EmbedTitle = "You have been warned";
            const EmbedDescription = `__By:__  <@${interaction.member.user.id}> \n __Reason:__ **${reason}** \n*If you want to contest this, please contact the head staff.*`;
            const EmbedColor = "#ff6767";

            let embed = new EmbedBuilder(
                {
                    title: EmbedTitle,
                    description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true })
                    }
                }).setColor(EmbedColor ? EmbedColor : "Blurple")

            user.send({ embeds: [embed] })
                .catch(() => {
                    console.log(`❌: Cant send message to <@${warnrequest.member.user.id}> (Probably disable his DM)`);
                    let embed = new EmbedBuilder()
                        .setDescription(`<:redcross:1038240381143363585> : Cant send message to <@${warnrequest.member.user.id}> (Probably disable his DM)`)
                        .setColor('Red')
                    interaction.editReply({ embeds: [embed], ephemeral: true});
                })

            let warns = await client.db.getData('/warns/');

            warns.push({
                userId: user.id,
                reason: reason,
                guildId: interaction.guild.id,
                warnerId: interaction.member.id,
                time: Math.round(Date.now() / 1000),
                // create timestamp
            });
            await client.db.push('/warns/',warns)
            await interaction.editReply({
                content: `✅: Successfully warned <@${user.id}> for ${reason}`,
                ephemeral: true
            });
            console.log(`✅: Successfully warned ${user.tag} for ${reason}`)

        }

        // ban


        if (interaction.customId === 'bandeny') {
            const modal = new ModalBuilder()
                .setCustomId("banmodal")
                .setTitle("Reason");

            const field = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("banfield")
                    .setLabel("Reason")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );
            modal.addComponents([field]);
            return await interaction.showModal(modal);
        }

        if (interaction.customId === 'banaccept') {
            const user = banmember.user
            const guild = interaction.guild;
            await interaction.reply({
                content: 'Accepted!',
                ephemeral: true
            });
            await interaction.message.delete();
            const EmbedTitle = "You Have been Banned!";
            const EmbedDescription = "By: " + banmember.user.tag + "\nReason: **" + banrequest.reason + "**\nIf you want to get unbaned follow this link : " + config.banlink;
            const EmbedColor = "#FF0000";

            let embed = new EmbedBuilder(
                {
                    title: EmbedTitle,
                    description: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"),
                    footer: {
                        text: guild.name,
                        icon_url: guild.iconURL({ dynamic: true })
                    }
                }
            ).setColor(EmbedColor ? EmbedColor : "Blurple")

            user.send({ embeds: [embed] }).catch((err) => {
                console.log(`❌: Cant DM ${user.tag} (probably disable his DM)`);
                console.log(err)
            })
            console.log(`✅: Embed Send to ${user.tag}, now waiting for the ban... `);


            await banmember.ban({ reason: banrequest.reason })
                .catch(() => {
                    console.log(`❌: Cant ban ${banmember.user.tag} (Permission missing)`)

                    interaction.editReply({
                        content: `❌: Cant ban ${banmember.user.tag} (Permission missing)`,
                        ephemeral: true
                    })
                })
        }
    }
});

