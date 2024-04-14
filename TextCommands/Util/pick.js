module.exports = {
  name: "pick",
  group: "util",
  aliases: ["chon"],
  cooldown: 0,
  description: "Hãy để bot lựa chọn giúp bạn",
  usage: "{prefix}pick <lựa chọn 1>, <lựa chọn 2>, <lựa chọn n>",
  async execute(client, message, args) {
   if (!args[0] || !args[1]) return message.channel.send(`${client.e.error} Sai cú pháp!`);
    const pickWordlist = args.join(' ').split(',');
    const pick = pickWordlist[Math.floor(Math.random() * pickWordlist.length)];
    await message.reply(`<:baka:989356963194368091> **Có pick cũng phải nhờ, tớ chọn: ${pick}**`);
  }
}