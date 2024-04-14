module.exports = {
  name: "pray",
  group: "util",
  aliases: ["curse"],
  cooldown: 300,
  description: "Cầu nguyện cho mình hoặc người khác",
  usage: "{prefix}pray <mention | id | tên>",
  async execute(client, message, args) {
    let member = undefined;
    if (args.length > 0) {
      member = await client.getUser(message, args[0], false);
      if (!member) {
        return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy người dùng này!`, 5000, "reply")
      }
    }
    if (member && member.user.id == message.author.id) member = undefined;

    if (client.cmd == "pray") {
      let prayText = `🙏 | **${message.author.username}** đã cầu nguyện`;
      
      if (member) {
        await client.trupray(message.author.id, 1);
        await client.congpray(member.user.id, 1);
        prayText += ` cho **${member.user.username}**.`;
        let prayed = await client.prayed(message.author.id);
        prayText += `\n<a:flower:1115750200003280928> | Bạn có **${prayed}** điểm may mắn!`;
        await message.channel.send(prayText)
      } else {
        await client.congpray(message.author.id, 1);
        let prayed = await client.prayed(message.author.id);
        prayText += `\n<a:flower:1115750200003280928> | Bạn có **${prayed}** điểm may mắn!`;
        await message.channel.send(prayText)
      }
    }
    if (client.cmd == "curse") {
      let curseText = `👻 | **${message.author.username}** đã`;

      if (member) {
        await client.trupray(member.user.id, 1);
        await client.congpray(message.author.id, 1);
        curseText += ` nguyền rủa **${member.user.username}**.`;
        let prayed = await client.prayed(message.author.id);
        curseText += `\n<a:flower:1115750200003280928> | Bạn có **${prayed}** điểm may mắn!`;
        await message.channel.send(curseText);
      } else {
        await client.trupray(message.author.id, 1);
        curseText += ` bị nguyền rủa.`;
        let prayed = await client.prayed(message.author.id);
        curseText += `\n<a:flower:1115750200003280928> | Bạn có **${prayed}** điểm may mắn!`;
        await message.channel.send(curseText);
      }
    }
  }
}