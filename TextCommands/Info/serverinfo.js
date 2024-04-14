const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  group: "info",
  aliases: ["si"],
  cooldown: 5,
  description: "Hiển thị thông tin về máy chủ",
  usage: "{prefix}serverinfo",
  async execute(client, message, args) {
    const members = await message.guild.members.fetch();

    const embed = new EmbedBuilder()
      .setColor(client.c.fvr)
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "Chung",
          value:
            `
          Tên: ${message.guild.name}
          Owner: <@${message.guild.ownerId}>
          Tạo Ra Lúc: <t:${parseInt(message.guild.createdTimestamp / 1000)}:R>
          Mô Tả: ${message.guild.description || "Không Có Mô Tả Về Máy Chủ Này"}
          Vai Trò: ${message.guild.roles.cache.size}
          `
        },
        {
          name: `Người Dùng`,
          value:
          `
          - Thành Viên: ${members.filter(m => !m.user.bot).size}
          - Bot: ${members.filter(m => m.user.bot).size}
          
          Tổng Cộng: ${message.guild.memberCount}
          `
        },
        {
          name: "Kênh",
          value:
            `
          - Text: ${message.guild.channels.cache.filter(c => c.type === 0).size}
          - Voice: ${message.guild.channels.cache.filter(c => c.type === 2).size}
          - Threads: ${message.guild.channels.cache.filter(c => c.type === 10 && 11 && 12).size}
          - Category: ${message.guild.channels.cache.filter(c => c.type === 4).size}
          - Stages: ${message.guild.channels.cache.filter(c => c.type === 13).size}
          
          Tổng Cộng: ${message.guild.channels.cache.size}
          `
        },
        {
          name: "Emoji & Sticker",
          value:
            `
          - Emoji Thường: ${message.guild.emojis.cache.filter(e => !e.animated).size}
          - Emoji Động: ${message.guild.emojis.cache.filter(e => e.animated).size}
          - Sticker: ${message.guild.stickers.cache.size}

          Tổng Cộng: ${message.guild.emojis.cache.size + message.guild.stickers.cache.size}  
          `
        },
        {
          name: "Thống Kê Nitro",
          value:
            `
        - Cấp: ${message.guild.premiumTier}
        - Số Lượng Boost: ${message.guild.premiumSubscriptionCount}
        - Người Boost: ${members.filter(m => m.premiumSince).size}
        `
        }
      )
      .setFooter({ text: `Được yêu cầu bởi ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] })
  },
};