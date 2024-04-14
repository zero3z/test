const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "nick",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Đặt biệt hiệu cho bản thân",
  usage: "{prefix}nick <nickname>",
  bperms: ["ManageNicknames"],
  uperms: ["ChangeNickname"],
  async execute(client, message, args) {
    const member = message.member;
    if (member.id === message.guild.ownerId) return client.deleteMsg(message, `${client.e.error} Tớ kkông có quyền để đổi biệt danh cho người cầm key server`, 5000, "reply");
    
    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) return client.deleteMsg(message, `${client.e.error} Tớ không thể đổi tên cho cậu vì cậu có vai trò cao hơn tớ`, 5000, "reply");
    

    let nickname = args.join(' ');
    if (!nickname) nickname = member.user.username
    if (nickname.length >= 30) {
      return client.deleteMsg(message, `${client.e.error} Tên bạn muốn đặt dài hơn 30 ký tự!`, 5000, "reply");
    }
    await member.setNickname(nickname);
    await message.react(client.e.success);
  },
};