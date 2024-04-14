const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "role",
  group: "moderation",
  aliases: [],
  cooldown: 0,
  description: "Thêm hoặc gỡ bỏ vai trò cho thành viên",
  usage: "{prefix}role <mention | id | tên> <mention | id | tên >",
  bperms: ["ManageRoles"],
  uperms: ["ManageRoles"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false);

    if (!member) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply");

    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể đưa hay gỡ vai trò của người này vì người này có vai trò cao hơn tớ`, 5000, "reply");

    const toFind = args.slice(1).join(" ").toLowerCase();
    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(r => r.id.includes(toFind) || r.name.toLowerCase().includes(toFind));

    if (!role) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy vai trò này!`, 5000, "reply");

    const hasRole = member.roles.cache.find(r => r.id === role.id)
    if (!hasRole) {
      await member.roles.add(role.id)
      await message.channel.send({ embeds: [
        new EmbedBuilder()
        .setColor(client.c.green)
        .setDescription(
          `***${client.e.success} | Đã thêm vai trò **${role.name}** cho **${member.user.tag}***`)
      ]})
    }
    else {
      await member.roles.remove(role.id)
      await message.channel.send({ embeds: [
        new EmbedBuilder()
        .setColor(client.c.green)
        .setDescription(
          `***${client.e.success} | Đã gỡ vai trò **${role.name}** cho **${member.user.tag}***`)
      ]})
    }
  }
}