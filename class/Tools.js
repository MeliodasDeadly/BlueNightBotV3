const {Collection, EmbedBuilder} = require("discord.js");
const colors = require('colors');
const url = require("url");

class Tools {
    /**
     * @desc Get a random number between min and max
     * @param {Number} min Number | min - max
     * @param {Number} max Number | min - max
     * @returns Number
     */
    getRandomNum(min, max) {
        try {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }

    /**
     * @desc Log Action
     * @param {*} interaction discord Interaction
     * @param {string} channelid discord Channel
     * @param {string} text discord text
     * @returns Void
     */
    createLog(interaction, channelid, text, name, tag, avatar) {
        try {
            const channel = interaction.guild.channels.cache.get(channelid)
            let color
            switch (interaction.commandName) {
                case "ban":
                    color = parseInt("5f0a08", 16)
                    break;
                case "banrequest":
                    color = parseInt("5f0a08", 16)
                    break;
                case "unban":
                    color = parseInt("5f0a08", 16)
                    break;
                case "kick":
                    color = parseInt("FF0000", 16)
                    break;
                case "mute":
                    color = parseInt("f160e4", 16)
                    break;
                case "unmute":
                    color = parseInt("f160e4", 16)
                    break;
                case "warn":
                    color = parseInt("de0000", 16)
                    break;
                case "listwarn":
                    color = parseInt("de0000", 16)
                    break;
                case "warnrequest":
                    color = parseInt("de0000", 16)
                    break;
                case "clear":
                    color = parseInt("7bf37a", 16)
                    break;
                case "forceclear":
                    color = parseInt("7bf37a", 16)
                    break;
                case "slowmode":
                    color = parseInt("cbef49", 16)
                    break;
                case "lock":
                    color = parseInt("f6989c", 16)
                    break;
                case "unlock":
                    color = parseInt("f6989c", 16)
                    break;
                case "embed":
                    color = parseInt("FFA500", 16)
                    break;
                case "say":
                    color = parseInt("FFA500", 16)
                    break;
                case "ping":
                    color = parseInt("FFA500", 16)
                    break;
                case "help":
                    color = parseInt("FFA500", 16)
                    break;
                default:
                    color = parseInt("373cee", 16)
                    break;

            }

            channel.send({
                embeds: [
                    new EmbedBuilder({
                        title: "Has trigered a command:",
                        author: {
                            name: tag,
                            icon_url: avatar,
                        },
                        description: text,
                        color: color,
                        timestamp: new Date(),
                        footer: {
                            text: interaction.guild.name,
                            icon_url: interaction.guild.iconURL({dynamic: true})
                        }

                    })
                ]
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }


    /**
     * @desc Get a random color in int
     * @returns string
     */
    getRandomColor() {
        try {
            return Math.floor(Math.random() * 16777215).toString(16);
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    };

    /**
     * @desc convert seconds to a duration string
     * @param {Number|string} data
     * @returns string
     */
    format(data) {
        const seconds = parseFloat(data);

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor(seconds % (3600 * 24) / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const seconds2 = Math.floor(seconds % 60);

        const dDisplay = days > 0 ? days + (days === 1 ? " jour, " : " jours, ") : "";
        const hDisplay = hours > 0 ? hours + (hours === 1 ? " heure, " : " heures, ") : "";
        const mDisplay = minutes > 0 ? minutes + (minutes === 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = seconds2 > 0 ? seconds2 + (seconds2 === 1 ? " seconde" : " secondes") : "";

        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

    /**
     * @desc check cooldown command
     * @param {*} interaction
     * @param {*} command
     * @returns * | boolean
     */
    checkCooldown(interaction, command) {
        const client = interaction.client;

        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 60) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                return (expirationTime - now) / 1000;
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            return false;
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        return false;
    };

    /**
     * @desc check role of user and add or remove
     * @param {Object} interaction
     * @param {Object} role
     * @returns void
     */
    async checkRole(interaction, role) {
        try {
            if (interaction.member.roles.cache.has(role)) {
                await interaction.member.roles.remove(role);
                return interaction.reply({
                    content: `<@${interaction.user.id}>`,
                    embeds: [
                        new EmbedBuilder({
                            title: "✅ Rôle supprimé !",
                            description: "Le rôle <@&" + role + "> a été supprimé avec succès.",
                            color: parseInt("00FF00", 16)
                        })
                    ],
                    ephemeral: true
                });
            }

            await interaction.member.roles.add(role);
            return interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [
                    new EmbedBuilder({
                        title: "✅ Rôle ajouté !",
                        description: "Le rôle <@&" + role + "> a été ajouté avec succès à votre profil.",
                        color: parseInt("00FF00", 16)
                    })
                ],
                ephemeral: true
            });
        } catch (e) {
            throw e;
        }
    }

    /**
     * Logger for debug
     * @param {string} message
     * @param {string} type
     * @returns void
     */
    logger(message, type = "log") {

        const date = new Date();

        const dateDay = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
        const dateMonth = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);

        const dateTime = `${dateDay}-${dateMonth}-${date.getFullYear()} ` +
            `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        switch (type) {
            case "log":
                return console.log(
                    `[${dateTime.grey}] : [${type.toUpperCase().bgBlue}] ➜  ${message}`
                );

            case "debug":
                return console.log(
                    `[${dateTime.grey}] : [${type.toUpperCase().bgYellow}] ➜  ${message}`
                );
            case "ready":
                return console.log(
                    `[${dateTime.grey}] : [${type.toUpperCase().bgGreen}] ➜  ${message}`
                );
            case "error":
                return console.log(
                    `[${dateTime.grey}] : [${type.toUpperCase().bgRed}] ➜  ${message}`
                );
            case "cmd":
                return console.log(
                    `[${dateTime.grey}] : [${type.toUpperCase().bgWhite}] ➜  ${message}`
                );
            default:
                throw new TypeError(
                    "Le type de log doit être soit debug, log, ready, cmd ou error."
                );
        }

    };
}

module.exports = Tools;