const {EmbedBuilder, PermissionsBitField} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: "timeout", // Name of command
    description: "timeout a user", // Command description
    type: 1, // Command type
    options: [
        {
            name: "user",
            description: "The member to timeout",
            type: 6,
            required: true
        },
        {
            name: "time",
            description: "Usage (1s, 1m, 1h, 1d)",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: "The reason for the timeout",
            type: 3,
            required: true
        }

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ModerateMembers // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: ['1037436624004464700'],
    run: async (client, interaction, config, db) => {
        try {
            const {
                channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const member = options.getMember('user');
            const time = options.getString('time');
            // convert time in ms
            const timeInMs = ms(time);
            const reason = options.getString('reason');
            const embed = new EmbedBuilder()
                .setTitle('Timeout')
                .setDescription(`You have been timed out for ${time} minutes for ${reason}`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({
                    text: interaction.guild.name,
                    iconUrl: interaction.guild.iconURL
                });
            member.user.send({embeds: [embed]}).catch(() => {
                console.log('Could not send timeout message to user')
            })
            member.timeout(timeInMs, reason).then(() => {
                interaction.reply({
                    content: `Successfully timed out <@${member.user.id}> for ${time} minutes for ${reason}`,
                    ephemeral: true
                })

            })


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
