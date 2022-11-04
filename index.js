const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");

const Toolbox = require('./class/Tools');

const tools = new Toolbox();

global.tools = tools;

// Creating a new client:
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildBans,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
    presence: {
        activities: [{
            name: "BlueNight Bot | https://bluenights.club",
            type: 0
        }],
        status: 'dnd'
    }
});

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
    tools.logger("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.", "error");
    return process.exit();
}


// Handler:
client.slash_commands = new Collection();
client.cooldowns = new Collection();
client.events = new Collection();
// var
client.banRequest = new Collection();
module.exports = client;

["application_commands", "events"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
    .catch((err) => {
        tools.logger("[CRASH] Something went wrong while connecting to your bot...", "error");
        tools.logger("[CRASH] Error from Discord API:" + err, "error");
        return process.exit();
    });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
    tools.logger("[CRASH] Unhandled Rejection with error: " + err, "error");
    console.error(promise);
});
