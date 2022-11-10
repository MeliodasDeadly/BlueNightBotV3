const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Ping!",
    usage: "ping",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    alloweduserids: [],
    requiredroles: [],
    cooldown: 5,
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Pong! \`${client.ws.ping} ms\``)
                    .setColor('Random')
            ],
            ephemeral: true
        })
    },
};
