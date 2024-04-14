const { EmbedBuilder } = require("discord.js");

const badgeFlags = {
  ActiveDeveloper: "<:dm_activedeveloper:1164319021173325917>",
  BugHunterLevel1: "<:dm_bughunter:1164318907511865424>",
  BugHunterLevel2: "<:dm_goldenbughunter:1164318948251140228>",
  CertifiedModerator: "<:dm_moderatorprogram:1164319117130612736>",
  HypeSquadOnlineHouse1: "<:dm_bravery:1164318740096237698>",
  HypeSquadOnlineHouse2: "<:dm_brilliance:1164318811768496138>",
  HypeSquadOnlineHouse3: "<:dm_balance:1164318784136421456>",
  Hypesquad: "<:dm_hypesquadevents:1164320196866080839>",
  PremiumEarlySupporter: "<:dm_earlysupporter:1164319143084961872>",
  Partner: "<:dm_partnerdiscord:1164319052320223273>",
  Staff: "<:dm_discordstaff:1164319080820515018>",
  VerifiedDeveloper: "<:dm_verifieddeveloper:1164319558501404743>",
}
const flags = {
  ActiveDeveloper: "Active Developer",
  BugHunterLevel1: "Discord Bug Hunter",
  BugHunterLevel2: "Discord Bug Hunter",
  CertifiedModerator: "Certified Moderator",
  HypeSquadOnlineHouse1: "House Bravery Member",
  HypeSquadOnlineHouse2: "House Brilliance Member",
  HypeSquadOnlineHouse3: "House Balance Member",
  Hypesquad: "HypeSquad Events",
  PremiumEarlySupporter: "Early Supporter",
  Partner: "Partner",
  Staff: "Discord Staff",
  VerifiedDeveloper: "(early)Verified Bot Developer",
}

module.exports = {
  name: "userinfo",
  group: "info",
  aliases: ["whois", "ws", "ui"],
  cooldown: 5,
  description: "Kiểm tra thông tin của bạn hoặc người khác",
  usage: "{prefix}userinfo <mention | id | tên>",
  async execute(client, message, args) {
    let member = undefined;
    if (args.length > 0) {
      member = await client.getUser(message, args.join(" "), false);
      if (!member) return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy người dùng này!`, 5000, "reply")
    } else {
      member = message.member;
    }
    
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1);
    const userFlags = member.user.flags ? member.user.flags.toArray() : [];

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${member.user.tag} (${member.user.id})`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(member.displayHexColor)
      .addFields(
        {
          name: "Flags",
          value: `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
          inline: true,
        },
        {
          name: "Badges",
          value: `${userFlags.length ? userFlags.map(flag => badgeFlags[flag]).join(' ') : 'None'}`,
          inline: true,
        },
        {
          name: "Tham gia Discord:",
          value: `<t:${parseInt(member.user.createdAt / 1000)}:F>`,
          inline: true
        },
        {
          name: "Tham gia máy chủ:",
          value: `<t:${parseInt(member.joinedAt / 1000)}:F>`,
          inline: true
        },
        {
          name: `**Vai trò [${roles.length}]:**`,
          value: `${roles.length ? roles.join(', ') : 'None'}`
        }
      )
      .setFooter({ text: `Được yêu cầu bởi ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] })
  }
}