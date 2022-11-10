const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const sheetconfig = require('../../../botconfig/sheet.json');
const bluenight = require('../../../botconfig/bluenight.json');


module.exports = {
    name: "ban", // Name of command
    description: "ban", // Command description
    type: 1, // Command type
    options: [
        {
            type: 6,
            name: "user",
            description: "The user to ban",
            required: true
        },
        {
            type: 3,
            name: "reason",
            description: "The reason for the ban",
            required: true
        },
        {
            type: 4,
            name: "deletetime",
            description: "The time to delete messages",
            required: true,
            choices: [
                {
                    name: "5 min",
                    value: 0
                },
                {
                    name: "1 day",
                    value: 1
                },
                {
                    name: "1 week",
                    value: 2
                },
            ]

        }
    ], // Command options
    cooldown: 5,
    permissions: {
        //DEFAULT_PERMISSIONS: PermissionsBitField.Flags.BanMembers, // Client permissions needed
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.BanMembers // User permissions needed
    },
    alloweduserids: [],
    requiredroles: [],

    run: async (client, interaction, config, db) => {

        try {

            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;

            let reason = options.getString("reason");
            let user = options.getMember("user");

            const { guild } = member;

            const EmbedTitle = "You Have been Banned!";
            const EmbedDescription = `By:  <@${member.user.id}> \nReason: **${reason}**\nIf you want to get unbaned follow this link :  ${config.banlink}`;
            const EmbedColor = "#FF0000";

            const StringOption = options.getInteger("deletetime");

            let timedelete;

            switch (StringOption) {
                case 0:
                    timedelete = 60 * 5;
                    break;
                case 1:
                    timedelete = 86400;
                    break;
                case 2:
                    timedelete = 86400 * 7;
                    break;
                default:
                    timedelete = 86400 * 7;
                    break;
            }

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
                console.log(`❌: Cant DM ${user.user.tag} (probably disable his DM)`);
            })
            console.log(`✅: Embed Send to ${user.user.tag}, now waiting for the ban... `);
            

            await user.ban({ deleteMessageSeconds: timedelete, reason }).catch((err) => {
                console.log(`❌: Cant ban ${user.user.tag} (Permission missing)`)
                throw `❌: Cant ban ${user.user.tag} (Permission missing)`
            })
            interaction.reply({ content: `✅: Successfully banned ${user.user.tag} for ${reason}`, ephemeral: true })
            


            const doc = new GoogleSpreadsheet(sheetconfig.Sheetid);

            await doc.useServiceAccountAuth({
                client_email: bluenight.client_email,
                private_key: bluenight.private_key,
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            await sheet.addRow({
                'User': user.user.tag,
                'UserID': user.user.id,
                'Reason': reason,
                'Date': new Date().toLocaleString(),
                'Moderator': member.user.tag,
                'ModeratorID': member.id,
            }).catch((err) => {

                    console.log(`❌: Error when adding ${user.user.tag} to the Google Sheet!`)
                    return console.log(String(err.stack).bgRed)

                })
                console.log(`✅: Successfully added ${user.user.tag} to the Google Sheet!`);
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return interaction.reply({ content: e , ephemeral: true })
        }

        // execute
    },
};