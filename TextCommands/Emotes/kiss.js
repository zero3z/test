const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "kiss",
  group: "emotes",
  aliases: ["thom"],
  cooldown: 3,
  description: "Hôn một ai đó",
  usage: "{prefix}kiss <mention | id | tên>",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/sfw/kiss');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    if (!member) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng!`, 5000, "reply");
    }
    else if (member.id === message.author.id) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể tự hôn chính mình!`, 5000, "reply");
    }

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${member.user.username} đã nhận được một cái hun nồng cháy từ ${message.author.username} 😘`, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor("#FFD5D1")
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]});
  }
}