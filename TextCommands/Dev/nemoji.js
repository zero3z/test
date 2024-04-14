const { parseEmoji, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nemoji",
  async execute(client, message, args) {
    const emoji = args[0];
    if (!emoji) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng thêm emoji cần phóng to!`, 5000, "reply")
    }
    const custom = await parseEmoji(emoji);
    if (!custom || !custom.id) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng chọn một emoji phù hợp!`, 5000, "reply")
    }
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Big Emoji!!" })
      .setDescription(`\`${custom.name} ${custom.id}\``)
      .setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`)
      .setFooter({ text: `Được yêu cầu bởi: ${message.member.user.username}`, iconURL: message.author.displayAvatarURL() });

    await message.channel.send({ embeds: [embed] })
  }
}