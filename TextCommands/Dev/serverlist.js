/* const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "serverlist",
  group: "dev",
  aliases: ["serverl", "svl"],
  cooldown: 0,
  description: "Show the Server list Which client Joined...",
  usage: "{prefix}serverlist",
  async execute(client, message, args) {
   let description =
        `Total Servers - ${client.guilds.cache.size}\n\n` +
        client.guilds.cache
          .sort((a, b) => b.memberCount - a.memberCount)
          .map((r) => r)
          .map(
            (r, i) =>
              `**${i + 1}** - **${r.name}** | \`${r.memberCount}\` Members\nID - ${r.id}`
          )
          .slice(0, 25)
          .join("\n");

    const embed = new EmbedBuilder()
    .setDescription(description);

    await message.channel.send({ embeds: [embed]})
  }
} */

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "serverlist",
  group: "dev",
  aliases: ["serverl", "svl"],
  cooldown: 0,
  description: "Hiển thị danh sách server mà client đã tham gia...",
  usage: "{prefix}serverlist",
  async execute(client, message, args) {
    const pageSize = 10; // Số lượng server mỗi trang
    let pageIndex = 0; // Trang hiện tại

    // Hàm tạo nội dung cho embed
    const createDescription = (guilds, page) => {
      return (
        `Tổng số server - ${guilds.length}\n\n` +
        guilds
          .sort((a, b) => b.memberCount - a.memberCount)
          .slice(page * pageSize, (page + 1) * pageSize)
          .map(
            (r, i) =>
              `**${page * pageSize + i + 1}** - **${r.name}** | \`${r.memberCount}\` Thành viên\nID - ${r.id}`
          )
          .join("\n")
      );
    };

    const guilds = client.guilds.cache.map((guild) => guild);
    const totalPages = Math.ceil(guilds.length / pageSize);

    const createEmbed = (page) => {
      const description = createDescription(guilds, page);
      return new EmbedBuilder().setDescription(description);
    };

    const createButtons = (page) => {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Trước")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Sau")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page >= totalPages - 1)
      );
      return row;
    };

    const embed = createEmbed(pageIndex);
    const row = createButtons(pageIndex);

    const reply = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.member.id !== message.author.id) return;
      await interaction.deferUpdate();
      pageIndex += interaction.customId === "previous" ? -1 : 1;
      const newEmbed = createEmbed(pageIndex);
      const newRow = createButtons(pageIndex);
      await interaction.editReply({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on("end", async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Trước")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Sau")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );
      await reply.edit({
        components: [disabledRow],
      });
    });
  },
};
