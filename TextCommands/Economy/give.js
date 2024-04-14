module.exports = {
  name: "give",
  group: "economy",
  aliases: ["send", "chuyentien", "transfer"],
  cooldown: 5,
  description: "Kiểm tra số tiền của bạn",
  usage: "{prefix}give <mention | id | tên> <money>",
  async execute(client, message, args) {
    const user = await client.getUser(message, args[0], false);
    if (!user) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 3000, "reply");
    }
    if (user.id === message.author.id) {
      return client.deleteMsg(message, `${client.e.error} Sao bạn lại tự gửi tiền cho bản thân...`, 3000, "reply");
    }
    if (user.bot) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể chuyển tiền cho bot được!`, 3000, "reply")
    }
    let coinsToGive = args[1];
    if (!coinsToGive) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng thêm số tiền bạn muốn chuyển!`, 3000, "reply")
    }
    if (isNaN(coinsToGive)) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng chuyển một số tiền hợp lệ!`, 3000, "reply")
    }
    if (parseInt(coinsToGive) <= 0) {
      return client.deleteMsg(message, `${client.e.error} Số tiền để chuyển phải là số nguyên dương!`, 3000, "reply")
    }
    if ((await client.cash(message.author.id)) < parseInt(coinsToGive)) {
      return client.deleteMsg(message, `${client.e.error} Bạn không có đủ số tiền để chuyển!`, 3000, "reply")
    }
    await client.trucash(message.author.id, parseInt(coinsToGive))
    await client.congcash(user.id, parseInt(coinsToGive))

    await message.channel.send(`${client.e.coin} **| ${message.author.username}** đã chuyển **${parseInt(coinsToGive).toLocaleString("en-us")} carro** cho **${user.user.username}**`)
  },
};