const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "ban",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Cấm thành viên khỏi server",
  usage: "{prefix}ban <mention | id | tên> <lý do>",
  bperms: ["BanMembers"],
  uperms: ["BanMembers"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false);
    const reason = args.slice(1).join(" ") || "Không có lý do";

    if (!member) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply");

    if (member.permissions.has("Administrator")) return client.deleteMsg(message, `${client.e.error} Người này là mod/admin, tớ không thể ban được`, 5000, "reply");

    if (
      member.id === client.user.id ||
      member.id === message.guild.ownerId ||
      member.id === message.author.id ||
      !member.banable
    ) return client.deleteMsg(message, `${client.e.error} Tớ không thể ban người dùng này được!`, 5000, "reply");

    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể ban người này vì người này có vai trò cao hơn tớ`, 5000, "reply");

    await member.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`***Bạn đã bị cấm tại ${message.guild.name} | Lý do: ${reason}***`)
          .setColor(client.c.red)
      ]
    }).catch()

    await message.member.guild.bans.create(member.id, { days: 0 })
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.c.green)
          .setDescription(`***${client.e.success} | Đã cấm thành viên ${member.user.tag} (${member.id}) khỏi server!\nLý do: ${reason}***`)
      ]
    })
  },
};