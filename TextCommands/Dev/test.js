const axios = require("axios")
const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: "test",
  group: "dev",
  aliases: [],
  cooldown: 0,
  description: "Test",
  usage: "{prefix}test",
  async execute(client, message, args) {
    const guild = await client.guilds.cache.get(args[0])
    const channel = await guild.channels.cache.find(ch => ch.type === 0); 
    const invites = await channel.createInvite()
      await message.reply(`https://discord.gg/${invites.code}`)
  },
};