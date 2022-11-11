const client = require("../../index");
const settings = require("../../config/config.js")
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js");
const {PermissionsBitField, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = {
    name: 'SelectMenu',
};
client.on("interactionCreate", async interaction => {
    if (interaction.isSelectMenu()) {
        const selected = interaction.values.join(', ');

        if (interaction.customId === 'reactionrole') {
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
        if (interaction.customId === 'mod') {
            let reaction = await client.db.getData('/report/')
            const channel = client.channels.cache.get('1037412341647691886');

            const thread = channel.threads.cache.map(thread => thread.id)
            const threadcontent = thread.toString().replace(/[]/g, " ");
            reaction = reaction.filter(reaction => reaction.guildId === interaction.guild.id && reaction.threadId === threadcontent)
            switch (selected) {
                case 'banmember':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('memberbanmodal')
                            .setTitle('Ban')


                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("banfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);

                        return await interaction.showModal(modal);

                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'kickmember':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('memberkickmodal')
                            .setTitle('Kick')
                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("kickfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);
                        await interaction.showModal(modal);
                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'tempbanmember':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('membertbm')
                            .setTitle('TempBan')
                        const field = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("tempbanfield")
                                .setLabel("Reason")
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true),
                        );
                        const field2 = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("tempbantime")
                                .setLabel("Time (Usage: 1m, 1h, 1d, 1w)")
                                .setStyle(TextInputStyle.Short)
                        )
                        modal.addComponents([field, field2]);
                        await interaction.showModal(modal);
                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'warnmember':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('memberwarnmodal')
                            .setTitle('Warn')
                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("warnfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);
                        await interaction.showModal(modal);

                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }
                    break;
                // Target
                case 'banreported':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {

                        const modal = new ModalBuilder()
                            .setCustomId('reportbanmodal')
                            .setTitle('Ban')
                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("banfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);
                        await interaction.showModal(modal);

                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'kickreported':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('reportkickmodal')
                            .setTitle('Kick')
                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("kickfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);
                        await interaction.showModal(modal);
                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'tempbanreported':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('reporttbm')
                            .setTitle('TempBan')
                        const field = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("tempbanfield")
                                .setLabel("Reason")
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true),
                        );
                        const field2 = new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("tempbantime")
                                .setLabel("Time (Usage : 1d, 1h, 1m)")
                                .setStyle(TextInputStyle.Short)
                        )
                        modal.addComponents([field,field2]);
                        await interaction.showModal(modal);

                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }

                    break;
                case 'warnreported':
                    if (interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        const modal = new ModalBuilder()
                            .setCustomId('reportwarnmodal')
                            .setTitle('Warn')
                        const field = new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("warnfield")
                            .setLabel("Reason")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),);
                        modal.addComponents([field]);
                        await interaction.showModal(modal);

                    } else {
                        await interaction.reply({
                            content: `❌: You are not allowed to use this command!`,
                            ephemeral: true
                        })
                    }
                    break;

            }


        }

    }

})