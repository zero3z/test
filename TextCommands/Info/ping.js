const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  group: "info",
  aliases: ["pong"],
  cooldown: 2,
  description: "Xem độ trễ của bot",
  usage: "{prefix}ping",
  async execute(client, message, args) {
    const emoji = {
      good: "<:dm_greendot:1143998886394998857>",
      okay: "<:dm_yellowdot:1143998967680618517>",
      bad: "<:dm_reddot:1143998803955961937>"
    }

    const ws = client.ws.ping;
    const api = new Date() - new Date(message.createdTimestamp);
    const uptime = client.secondsToDhms(Math.floor(client.uptime / 1000));

    const wsEmoji = ws < 100 ? emoji.good : ws < 200 ? emoji.okay : emoji.bad;
    const apiEmoji = api < 500 ? emoji.good : api < 1000 ? emoji.okay : emoji.bad;

    const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor(client.c.fvr)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "🤖 Tin nhắn phản hồi",
          value: `${apiEmoji} ${api}`,
          inline: true
        },
        {
          name: "👾 WebSocket",
          value: `${wsEmoji} ${ws}`,
          inline: true
        },
        {
          name: "🕰️ Uptime",
          value: uptime
        }
      )
      .setTimestamp();

    await message.channel.send({ content: "🏓 Pong!!!", embeds: [embed] })
  }
}