module.exports = {
  name: "random",
  group: "util",
  aliases: ["rd"],
  cooldown: 0,
  description: "Quay ngẫu nhiên số",
  usage: "{prefix}random <số>",
  async execute(client, message, args) {
    if (!args[0]) args[0] = "10";
    if (args[0] <= 0 || isNaN(args[0])) {
      return client.deleteMsg(message, `${client.e.error} Số không khả dụng`, 5000, "reply")
    }
    const random = parseInt(args[0])
    let rd = Math.floor(Math.random() * random) + 1;
    await message.reply(`<a:foxiggle:1137472362342781000> **Con số may mắn của ${message.member} là:** __**${rd}**__ `);


  }
}