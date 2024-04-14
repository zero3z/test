const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  group: "info",
  cooldown: 2,
  description: "Xem độ trễ của bot",
  async execute(client, interaction) {
    const emoji = {
      good: "<:dm_greendot:1143998886394998857>",
      okay: "<:dm_yellowdot:1143998967680618517>",
      bad: "<:dm_reddot:1143998803955961937>"
    }

    const ws = interaction.client.ws.ping;
    const api = new Date() - new Date(interaction.createdTimestamp);
    const uptime = client.secondsToDhms(Math.floor(interaction.client.uptime / 1000));

    const wsEmoji = ws < 100 ? emoji.good : ws < 200 ? emoji.okay : emoji.bad;
    const apiEmoji = api < 500 ? emoji.good : api < 1000 ? emoji.okay : emoji.bad;

    const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor(client.c.fvr)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      {
        name: "🤖 Tin nhắn phản hồi",
        value: `${apiEmoji} ${api}`
      },
      {
        name: "👾 WebSocket",
        value: `${wsEmoji} ${ws}`
      },
      {
        name: "🕰️ Uptime",
        value: uptime
      }
    )
    .setTimestamp();

    await interaction.reply({ content: "🏓 Pong!!!", embeds: [embed]})
  }
}