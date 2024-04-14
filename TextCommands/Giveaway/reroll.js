module.exports = {
  name: "reroll",
  group: "giveaway",
  aliases: ["garr"],
  cooldown: 0,
  description: "Kết thúc giveaway",
  usage: "{prefix}reroll <Id ga>",
  async execute(client, message, args) {
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[0] && g.ended);
    if (!giveaway) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy giveaway nào như này cả hoặc giveaway chưa đã kết thúc, vui lòng thử lại sau!`, 5000, "reply")

    await client.giveawaysManager
      .reroll(giveaway.messageId, {
        messages: {
          congrat: client.gacf.messages.congrat,
          error: client.gacf.messages.error
        }
      })
    await message.delete().catch({})
  },
};