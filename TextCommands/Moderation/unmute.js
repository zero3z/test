module.exports = {
  name: "unmute",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Gỡ hạn chế thành viên trong server",
  usage: "{prefix}unmute <mention | id | tên>",
  bperms: ["ModerateMembers"],
  uperms: ["ModerateMembers"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false)
    const reason = args.slice(1).join(" ") || "Không có lí do";
    if (!member) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy người dùng này!`, 5000, "reply");

    if (member.communicationDisabledUntilTimestamp - Date.now() < 0) return client.deleteMsg(message, `${client.e.error} Tớ không thể unmute người dùng này, họ không bị mute!`, 5000, "reply");
    
    if (
      !member.moderatable
    ) return client.deleteMsg(message, `${client.e.error} Tớ không thể unmute người dùng này được!`, 5000, "reply"); 
    
    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể unmute người này vì người này có vai trò cao hơn tớ`, 5000, "reply");

    await member.timeout(null);
    await message.reply({ embeds: [
      new EmbedBuilder()
      .setDescription(`***${client.e.success} Đã unmute cho thành viên ${member.tag} (${member.id}).*** | Lý do: ${reason}`)
      .setColor(client.c.green)
    ]})
  },
};