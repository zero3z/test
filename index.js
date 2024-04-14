const { QuickDB } = require("quick.db");
const fs = require("node:fs");
require("./Databases/connect")();
require("colors");

const { Client, Collection, Partials, Options } = require("discord.js");
const client = new Client({
  intents: 3276799,
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember
  ],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    GuildMemberManager: {
      maxSize: 200,
      keepOverLimit: member => member.id === client.user.id
    },
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 3600,
      lifetime: 604800000,
    },
  },
  allowedMentions: {
    parse: [
      "users",
      "roles"
    ],
    repliedUser: true
  },
  presence: {
    status: "online"
  }
});

client.interactions = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.esnipes = new Collection();
client.snipes = new Collection();

module.exports = client;

client.gacf = require("./Assets/json/giveaways");
client.cf = require("./Assets/json/config");
client.c = require("./Assets/json/colors");
client.e = require("./Assets/json/emojis");
client.db = new QuickDB();

fs.readdirSync("./Handlers").forEach((handler) => {
  require(`./Handlers/${handler}`)(client);
});

client.login(process.env.token);

process.on('unhandledRejection', err => {
  console.error(`Unhandled promise rejection: ${err.message}.`);
  console.log(err);
});
process.on('uncaughtException', err => {
  console.error(`Uncaught exception: ${err.message}.`);
  console.log(err);
});

const express = require('express');
const app = express();
app.all('/', (req, res) => {
  res.send(`Express Activated`);
});
app.listen(3030);