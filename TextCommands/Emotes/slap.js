const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "slap",
  group: "emotes",
  aliases: ["tat"],
  cooldown: 3,
  description: "Tát một ai đó",
  usage: "{prefix}slap <mention | id | tên>",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/sfw/slap');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    const text = !member ? `${message.author.username} đã tự vả chính mình!` :
      `${message.author.username} đã tát vỡ mồm ${member.user.username}`;

    const embed = new EmbedBuilder()
    .setAuthor({ name: text, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor(client.c.fvr)
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]})
  }
}