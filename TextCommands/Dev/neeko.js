const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "neko",
  group: "dev",
  aliases: [],
  cooldown: 3,
  description: "Khoc mot minh",
  usage: "{prefix}cry",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/nsfw/neko');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }
    
    const embed = new EmbedBuilder()
    .setAuthor({ name: "Neko~~", iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor("#FFD5D1")
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]})
  }
}