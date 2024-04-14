module.exports = {
  name: "unban",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Gỡ cấm thành viên khỏi server",
  usage: "{prefix}uban <id | tên>",
  bperms: ["BanMembers"],
  uperms: ["BanMembers"],
  async execute(client, message, args) {
    const reason = args.slice(1).join(" ") || "Không có lý do";
    const member = await message.guild.bans.cache.find(u => 
      u.user.id === args[0] ||
      u.user.username === args[0] ||
      u.user.tag === args[0]
    )
    
    if (!member) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy người dùng này!`, 5000, "reply");
    
    await message.member.guild.bans.remove(member.id);
    await message.reply({ embeds: [
      new EmbedBuilder()
      .setDescription(`***${client.e.success} Đã gỡ ban cho thành viên ${member.tag} (${member.id}).*** | Lý do: ${reason}`)
      .setColor(client.c.green)
    ]})
  },
};