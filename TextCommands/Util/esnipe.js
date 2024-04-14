const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "esnipe",
  group: "util",
  aliases: ["esn"],
  cooldown: 0,
  description: "Kiểm tra tin nhắn bị chỉnh sửa trong kênh",
  usage: "{prefix}esnipe <số lượng>",
  bperms: ["ReadMessageHistory"],
  uperms: ["ReadMessageHistory"],
  async execute(client, message, args) {
    const esnipes = client.esnipes.get(message.channel.id);
    if (!esnipes) {
      return client.deleteMsg(message, `${client.e.error} Ở đây không có tin nhắn nào được chỉnh sửa cả`, 5000, "reply");
    }
    const sotn = args[0] - 1 || 0;
    const tnedit = esnipes[sotn];
    if (!tnedit) {
      return client.deleteMsg(message, `${client.e.error} Ở đây chỉ có \`${esnipes.length}\` tin nhắn đã chỉnh sửa`, 5000, "reply");
    }

    const { channel, oldMsg, newMsg, author, date } = tnedit;

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
      .addFields(
        { name: `> Tin nhắn cũ`, value: oldMsg },
        { name: `> Tin nhắn đã chỉnh sửa`, value: newMsg }
      )
      .setFooter({ text: `${sotn + 1}/${esnipes.length}` })
      .setTimestamp(date)
      .setColor(client.c.fvr);

    await message.reply({ embeds: [embed] })
  }
}