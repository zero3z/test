const ms = require("ms");

module.exports = {
  name: "mute",
  group: "moderation",
  aliases: ["timeout"],
  cooldown: 3,
  description: "Hạn chế thành viên trong server",
  usage: "{prefix}mute <mention | id | tên> <lí do>",
  bperms: ["ModerateMembers"],
  uperms: ["ModerateMembers"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false)
    const reason = args.slice(2).join(" ") || "Không có lí do";
    if (!member) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply");


    const time = ms(args[1]);
    if (!time) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập thời gian khả dụng!`, 5000, "reply");

    if (member.permissions.has("Administrator")) return client.deleteMsg(message, `${client.e.error} Người này là mod/admin, tớ không thể mute được`, 5000, "reply");

    if (
      member.id === client.user.id ||
      member.id === message.guild.ownerId ||
      member.id === message.author.id ||
      member.user.bot ||
      !member.moderatable
    ) return client.deleteMsg(message, `${client.e.error} Tớ không thể mute người dùng này được!`, 5000, "reply");

    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể mute người này vì người này có vai trò cao hơn tớ`, 5000, "reply");

    if (member.communicationDisabledUntilTimestamp - Date.now() > 0) return client.deleteMsg(message, `${client.e.error} Người dùng này đã bị mute rồi!`, 5000, "reply");

    await member.timeout(ms, reason);
    await message.reply({ embeds: [
      new EmbedBuilder()
      .setDescription(`***${client.e.success} | Đã mute thành viên ${member.user.tag}!***`)
      .setColor(client.c.green)
    ]})
  }
}