const client = require("../../index");
const {EmbedBuilder, ModalBuilder, ButtonBuilder, ActionRowBuilder,AuditLogEvent,ButtonStyle} = require("discord.js");
const config = require("../../config/config");
module.exports = {
    name: 'Ban',
};
client.on("guildBanAdd", async interaction => {
    const channel = client.channels.cache.get('1037412341647691886');
    // get the moderator who banned the user
    const fetchedLogs = await interaction.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
    });
    const banLog = fetchedLogs.entries.first();

    if (!banLog) return console.log(`${interaction.user.tag} was banned from ${interaction.guild.name} but no audit log could be found.`);

    const {executor, target} = banLog;
    if (target.id === interaction.user.id) {

        const embed = new EmbedBuilder()
            .setTitle('Ban')
            .setDescription(`**${interaction.user.tag}** has been banned from the server! \n__Reason:__ **${interaction.reason}** \n __User ID:__ **${interaction.user.id}** \n __Moderator:__ **<@${executor.id}>**`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({
                text: interaction.guild.name,
                iconUrl: interaction.guild.iconURL
            });
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Unban')
                    .setCustomId('unban'),
            );
        await channel.threads.create({
            name: `New Ban: ${interaction.user.id}`,
            message: {embeds: [embed], components: [row]},
            appliedTags: ['1037412763322032208']
        });
    }else{
        const embed = new EmbedBuilder()
            .setTitle('Ban')
                .setDescription(`**${interaction.user.tag}** has been banned from the server! \n__Reason:__ **${interaction.reason}** \n __User ID:__ **${interaction.user.id}**`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({
                text: interaction.guild.name,
                iconUrl: interaction.guild.iconURL
            });
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Unban')
                    .setCustomId('unban'),
            );
        await channel.threads.create({
            name: `New Ban: ${interaction.user.id}`,
            message: {embeds: [embed], components: [row]},
            appliedTags: ['1037412763322032208']
        });
    }




})