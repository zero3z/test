const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  group: "info",
  cooldown: 5,
  description: "Hiển thị thông tin về máy chủ",
  async execute(client, interaction) {
    const members = await interaction.guild.members.fetch();

    const embed = new EmbedBuilder()
    .setColor(client.c.fvr)
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .addFields(
      {
        name: "Chung",
        value:
          `
        Tên: ${interaction.guild.name}
        Owner: <@${interaction.guild.ownerId}>
        Tạo Ra Lúc: <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>
        Mô Tả: ${interaction.guild.description || "Không Có Mô Tả Về Máy Chủ Này"}
        Vai Trò: ${interaction.guild.roles.cache.size}
        `
      },
      {
        name: `Người Dùng`,
        value:
        `
        - Thành Viên: ${members.filter(m => !m.user.bot).size}
        - Bot: ${members.filter(m => m.user.bot).size}

        Tổng Cộng: ${interaction.guild.memberCount}
        `
      },
      {
        name: "Kênh",
        value:
          `
        - Text: ${interaction.guild.channels.cache.filter(c => c.type === 0).size}
        - Voice: ${interaction.guild.channels.cache.filter(c => c.type === 2).size}
        - Threads: ${interaction.guild.channels.cache.filter(c => c.type === 10 && 11 && 12).size}
        - Category: ${interaction.guild.channels.cache.filter(c => c.type === 4).size}
        - Stages: ${interaction.guild.channels.cache.filter(c => c.type === 13).size}

        Tổng Cộng: ${interaction.guild.channels.cache.size}
        `
      },
      {
        name: "Emoji & Sticker",
        value:
          `
        - Emoji Thường: ${interaction.guild.emojis.cache.filter(e => !e.animated).size}
        - Emoji Động: ${interaction.guild.emojis.cache.filter(e => e.animated).size}
        - Sticker: ${interaction.guild.stickers.cache.size}

        Tổng Cộng: ${interaction.guild.emojis.cache.size + interaction.guild.stickers.cache.size}  
        `
      },
      {
        name: "Thống Kê Nitro",
        value:
          `
      - Cấp: ${interaction.guild.premiumTier}
      - Số Lượng Boost: ${interaction.guild.premiumSubscriptionCount}
      - Người Boost: ${members.filter(m => m.premiumSince).size}
      `
      }
    )
    .setFooter({ text: `Được yêu cầu bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}