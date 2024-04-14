module.exports = {
  name: "balance",
  group: "economy",
  aliases: ["bal", "cash"],
  cooldown: 5,
  description: "Kiểm tra số tiền của bạn",
  usage: "{prefix}balance",
  async execute(client, message, args) {
    const cash = await client.cash(message.author.id);
    const money = parseInt(cash).toLocaleString("en-us");
    await message.channel.send(`${client.e.coin} **| ${message.author.username}**, Bạn hiện tại đang có **__${money}__ Carro!**`)
  },
};