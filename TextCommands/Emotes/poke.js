const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "poke",
  group: "emotes",
  aliases: ["chot", "choc"],
  cooldown: 3,
  description: "Chọc một ai đó",
  usage: "{prefix}poke <mention | id | tên>",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/sfw/poke');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    if (!member) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply");
    }
    else if (member.id === message.author.id) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể tự chọc chính mình!`, 5000, "reply");
    }
    
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${message.author.username} đã chọt ${member.user.username} 👉`, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor(client.c.fvr)
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]});
  }
}