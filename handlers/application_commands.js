const client = require("../index");
const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");
const colors = require("colors");

module.exports = (client, config) => {
    tools.logger("Application commands Handler :", "debug");

    let commands = [];

    // Slash commands handler:
    fs.readdirSync('./commands/slash/').forEach((dir) => {
        tools.logger("[!] Started loading slash commands from " + dir, "debug");
        const SlashCommands = fs.readdirSync(`./commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of SlashCommands) {
            let pull = require(`../commands/slash/${dir}/${file}`);

            if (pull.name, pull.description, pull.type == 1) {
                client.slash_commands.set(pull.name, pull);
                tools.logger(`[HANDLER - SLASH] Loaded a file: ${pull.name} (#${client.slash_commands.size})`, "ready");

                commands.push({
                    name: pull.name,
                    description: pull.description,
                    type: pull.type || 1,
                    options: pull.options ? pull.options : null,
                    default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
                    default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
                });

            } else {
                tools.logger(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`, "error");
            }
        }
    });

    // Registering all the application commands:
    if (!config.Client.ID) {
        tools.logger("[!] Couldn't register the application commands, missing client ID in the config file.", "error");
        return process.exit();
    }

    const rest = new REST({ version: '10' }).setToken(config.Client.TOKEN || process.env.TOKEN);

    (async () => {
        tools.logger("[HANDLER] Started registering all the application commands.", "debug");

        try {
            await rest.put(
                Routes.applicationCommands(config.Client.ID),
                { body: commands }
            );

            tools.logger("[HANDLER] Successfully registered all the application commands.", "ready");
        } catch (err) {
         //   console.log(err);
        }
    })();
};
