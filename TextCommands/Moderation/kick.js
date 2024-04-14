module.exports = {
  name: "kick",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Khai trừ thành viên khỏi server",
  usage: "{prefix}kick <mention | id | tên> <lý do>",
  bperms: ["KickMembers"],
  uperms: ["KickMembers"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args.join(" "), false);
    const reason = args.slice(1).join(" ") || "Không có lý do";
    if (!member) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply");

    if (member.permissions.has("Administrator")) return client.deleteMsg(message, `${client.e.error} Người này là mod/admin, tớ không thể kick được`, 5000, "reply");

    if (
      member.id === client.user.id ||
      member.id === message.guild.ownerId ||
      member.id === message.author.id ||
      !member.kickable
    ) return client.deleteMsg(message, `${client.e.error} Tớ không thể kick người dùng này được!`, 5000, "reply");
    
    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể kick người này vì người này có vai trò cao hơn tớ`, 5000, "reply");

    await member.send({ embeds: [
      new EmbedBuilder()
      .setDescription(`***Bạn đã bị đá khỏi ${message.guild.name} | Lý do: ${reason}***`)
      .setColor(client.c.red)
    
    ]}).catch()
    
    await member.kick()

    await message.reply({ embeds: [
      new EmbedBuilder()
      .setColor(client.c.green)
      .setDescription(`***${client.e.success} | Đã đá thành viên ${member.user.tag} (${member.id}) khỏi server!\nLý do: ${reason}***`)
    ]})
  }
}