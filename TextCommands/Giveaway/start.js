const ms = require('ms');

module.exports = {
  name: "start",
  group: "giveaway",
  aliases: ["ga", "gas", "startgiveaway", "giveaway"],
  cooldown: 0,
  description: "Tạo giveaway",
  usage: "{prefix}startgiveaway <Thời Gian> <Số người thắng> <Tiêu đề>",
  uperms: ["ManageMessages"],
  async execute(client, message, args) {
    if (!args[0]) {
      let activeGa = client.giveawaysManager.giveaways
        .filter((g) => g.guildId === message.guild.id && !g.ended)

      if (!activeGa) return client.deleteMsg(message, `${client.e.error} Hiện tại không có ga nào đang hoạt động cả`, 5000, "reply");

    } else {
      let giveawayChannel = message.channel;
      let giveawayDuration = args[0];
      if (!giveawayDuration || isNaN(ms(giveawayDuration))) return client.deleteMsg(message, `${client.e.error} Vui lòng nhập thời gian hợp lệ!`, 5000, "reply");


      let giveawayNumberWinners = args[1].replace(/w/g, "");
      if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) return client.deleteMsg(message, `${client.e.error} Vui lòng nhập số người tham gia hợp lệ!`, 5000, "reply");

      let giveawayPrize = args.slice(2).join(" ");
      if (!giveawayPrize) return client.deleteMsg(message, `${client.e.error} Vui lòng nhập tiêu đề hợp lệ!`, 5000, "reply");

      await client.giveawaysManager
        .start(giveawayChannel, {
          prize: giveawayPrize,
          duration: ms(giveawayDuration),
          winnerCount: parseInt(giveawayNumberWinners),
          hostedBy: message.author,
          messages: client.gacf.messages,
        })
      message.delete().catch()
    }
  }
}