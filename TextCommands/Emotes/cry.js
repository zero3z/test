const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "cry",
  group: "emotes",
  aliases: ["khoc"],
  cooldown: 3,
  description: "Khoc mot minh",
  usage: "{prefix}cry",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args) {
   const response = await axios.get('https://api.waifu.pics/sfw/cry');
    const image = response.data?.url;
    if (!image) {
      return client.deleteMsg(message, `${client.e.error} Đã có lỗi xảy ra với hình ảnh`, 5000, "reply");
    }

    const member = await client.getUser(message, args[0], false);
    
    const text = !member ? `${message.author.username} đã khóc rất to` :
      `${message.author.username} đã khóc trước mặt ${member.user.username}`;

    const embed = new EmbedBuilder()
    .setAuthor({ name: text, iconURL: message.author.avatarURL({ dynamic: true }) })
    .setColor(client.c.fvr)
    .setImage(image)
    .setTimestamp()

    await message.channel.send({ embeds: [embed]})
  }
}