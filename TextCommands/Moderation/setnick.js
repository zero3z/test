module.exports = {
  name: "setnick",
  group: "moderation",
  aliases: [],
  cooldown: 3,
  description: "Đặt biệt hiệu cho người khác",
  usage: "{prefix}setnick <mention | id | tên> <nickname>",
  bperms: ["ManageNicknames"],
  uperms: ["ChangeNickname"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false);
    if (!member) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`)

    if (member.permissions.has("Administrator")) return client.deleteMsg(message, `${client.e.error} Người này là mod/admin, tớ không thể đổi biệt danh được`, 5000, "reply");

    if (
      member.id === message.guild.ownerId ||
      !member.moderatable
    ) return client.deleteMsg(message, `${client.e.error} Tớ không có quyền để có thể đổi biệt danh cho người này!`, 5000, "reply");

    let nickname = args.slice(1).join(' ');
    if (!nickname) nickname = member.user.username
    if (nickname.length >= 30) return client.deleteMsg(message, `${client.e.error} Tên bạn muốn đặt dài hơn 30 ký tự!`, 5000, "reply");

    await member.setNickname(nickname);
    await message.react(client.e.success);
  },
};