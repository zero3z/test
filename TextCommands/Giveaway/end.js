const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "end",
  group: "giveaway",
  aliases: ["gaend"],
  cooldown: 0,
  description: "Kết thúc giveaway",
  usage: "{prefix}end <Id ga>",
  async execute(client, message, args) {
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[0] && !g.ended);
    if (!giveaway) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy giveaway nào như này cả hoặc ga đã kết thúc, vui lòng thử lại sau!`, 5000, "reply")

    await client.giveawaysManager
      .end(args[0])
      .then(async (g) => {
        await g.message.channel.send({
          content: "GIVEAWAY ENDED!",
          embeds: [
            new EmbedBuilder()
              .setDescription(`[Đi Tới Giveaway](${g.messageURL})`)
          ]
        })
      })
    await message.delete().catch({})
  },
};