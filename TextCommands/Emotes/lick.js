const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "lick",
  group: "emotes",
  aliases: ["liem"],
  cooldown: 3,
  description: "Liếm một ai đó",
  usage: "{prefix}lick <mention | id | tên>",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/sfw/lick');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    if (!member) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng!`, 5000, "reply");
    }
    else if (member.id === message.author.id) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể tự liếm chính mình!`, 5000, "reply");
    }

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${message.author.username} đã liếm ${member.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor(client.c.fvr)
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]});
  }
}