const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "hug",
  group: "emotes",
  aliases: ["om"],
  cooldown: 3,
  description: "Ôm một ai đó",
  usage: "{prefix}hug <mention | id | tên>",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
    const response = await axios.get('https://api.waifu.pics/sfw/hug');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    if (!member) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng!`, 5000, "reply");
    }
    else if (member.id === message.author.id) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể tự ôm chính mình!`, 5000, "reply");
    }

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${message.author.username} đã dành một cái ôm lớn cho ${member.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor(client.c.fvr)
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]});
  }
}

