const {EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder} = require('discord.js');

module.exports = {
    name: "report", // Name of command
    description: "Report a player", // Command description
    type: 1, // Command type
    options: [
        {
            name: "user",
            description: "The user you want to report",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "The reason why you want to report the user",
            type: 3,
            required: true,
        },
        {
            name: "proof",
            description: "The proof of the user breaking the rules (Post a screenshot in image hosting sites like imgur.com)",
            type: 3,
            required: true,
        }

    ], // Command options
    permissions: {
        //DEFAULT_PERMISSIONS: , // Client permissions needed [A FIX !!!!]
        DEFAULT_MEMBER_PERMISSIONS: PermissionsBitField.Flags.ViewChannel // User permissions needed | Use PermissionsBitField.Flags.
    },
    cooldown: 5,
    alloweduserids: [],
    requiredroles: [],
    run: async (client, interaction, config, db) => {
        try {
            const {
                member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const channel = client.channels.cache.get('1037412341647691886');
            const user = options.get('user');
            const embedR = new EmbedBuilder()
                .setDescription(`✅: Your report has been sent to the staff team!`)
            const embed = new EmbedBuilder({
                title: "Report",
                description: `__User:__ \n<@${options.getUser('user').id}> \n__Reason:__ \n${options.getString('reason')} \n__Proof:__ \n${options.getString('proof')}`,
                footer: {
                    text: `Reported by ${member.user.tag} (${interaction.member.id})`
                },
                author: {
                    name: member.user.tag,
                    icon_url: member.user.avatarURL({dynamic: true})
                }

            })
                .setTimestamp()
                .setColor('Red')

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel('✓')
                        .setCustomId('accept'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('X')
                        .setCustomId('deny'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('⚒')
                        .setCustomId('mod'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('📝')
                        .setCustomId('ticket'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('🗑')
                        .setCustomId('bin'),

                );

                    await channel.threads.create({
                        name: `Report by ${member.user.tag}`,
                        message: {embeds: [embed], components: [row]},
                        appliedTags: ['1040363280373395487']
                    });


            await interaction.reply({
                embeds: [embedR],
                ephemeral: true
            })
            let report = await client.db.getData('/report/');
            const guild = interaction.guild.id;
            const message = channel.threads.cache.map(message => message.id)
            const messagecontent = message.toString().replace(/[]/g, " ");
            const thread = channel.threads.cache.map(thread => thread.id)
            const threadcontent = thread.toString().replace(/[]/g, " ");

            report.push({
                guildId: guild,
                memberId: interaction.member.id,
                userId: user.user.id,
                messageId: messagecontent,
                threadId: threadcontent ,
                time: Math.round(Date.now() / 1000),
            });
            await client.db.push('/report/',report)
            console.log(`✅: Added  ${member.user.tag} to the database`)


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
};
