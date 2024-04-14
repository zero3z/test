const { parseEmoji } = require("discord.js");
const isURL = require('is-url');

module.exports = {
  name: "steal",
  group: "util",
  aliases: ["cuopemo"],
  cooldown: 10,
  description: "Lấy emoji từ nơi khác về set cho server",
  usage: "{prefix}steal <emoji> <tên emoji muốn set>",
  bperms: ["ManageEmojisAndStickers"],
  uperms: ["ManageEmojisAndStickers"],
  async execute(client, message, args) {
    let emoji;
    const custom = await parseEmoji(args[0]);
    if (custom && custom.id) emoji = custom
    else return client.deleteMsg(message, `${client.e.error} Vui lòng nhập emoji hợp lệ!`, 5000, "reply")
  if (!args[0]) {
    return client.deleteMsg(message, `${client.e.error} Vui lòng thêm tên cho emoji!`, 5000, "reply");
  }
  if (emoji.id) emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
  await message.guild.emojis.create({
    attachment: emoji,
    name: args.slice(1).join(" ")
  });
  await message.react(client.e.success);
  }
}