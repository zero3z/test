const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  group: "util",
  aliases: ["sn"],
  cooldown: 0,
  description: "Kiểm tra tin nhắn bị xóa trong kênh",
  usage: "{prefix}snipe <số lượng>",
  bperms: ["ReadMessageHistory"],
  uperms: ["ReadMessageHistory"],
  async execute(client, message, args) {
    let index = 0;
    const snipes = client.snipes.get(message.channel.id);
    if (!snipes) {
      return client.deleteMsg(message, `${client.e.error} Không có tin nhắn nào bị xoá `, 5000, "reply");
    }
    const sotn = args[0] - 1 || 0;
    const tnxoa = snipes[sotn];
    if (!tnxoa) {
      return client.deleteMsg(message, `${client.e.error} Ở đây chỉ có \`${snipes.length}\` tin nhắn đã xoá`, 5000, "reply");
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: tnxoa.author.username, iconURL: tnxoa.author.displayAvatarURL() })
      .setColor(client.c.fvr)
      .setDescription(`${tnxoa?.content || "tin nhắn không có nội dung"}`)
      .setFooter({ text: `Trang ${sotn + 1}/${snipes.length}` })
      .setTimestamp(tnxoa.date)

    if (tnxoa.image) embed.setImage(tnxoa.image);

    const button1 = new ButtonBuilder()
      .setCustomId("back_buttonSnipe")
      .setEmoji("<:back_button:1164742324107087893>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(index + sotn === 0);

    const button2 = new ButtonBuilder()
      .setCustomId("foward_buttonSnipe")
      .setEmoji("<:forward_button:1164742350933864448>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(index + sotn + 1 >= snipes.length);

    const row = new ActionRowBuilder().addComponents(button1, button2);

    const reply = await message.reply({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 });

    collector.on("collect", async (interaction) => {
      if (interaction.member.id !== message.author.id) return;
      await interaction.deferUpdate();
      index += interaction.customId === "back_buttonSnipe" ? -1 : 1;
      button1.setDisabled(index + sotn === 0);
      button2.setDisabled(index + sotn + 1 >= snipes.length)

      const nsotn = sotn + index;
      const ntnxoa = snipes[nsotn];

      const embed1 = new EmbedBuilder()
        .setAuthor({ name: ntnxoa.author.username, iconURL: ntnxoa.author.displayAvatarURL() })
        .setColor(client.c.fvr)
        .setDescription(`${ntnxoa.content.length != 0 ? ntnxoa.content : "tin nhắn không có nội dung"}`)
        .setFooter({ text: `${nsotn + 1}/${snipes.length}` })
        .setTimestamp(ntnxoa.date)
      if (ntnxoa.image) embed1.setImage(ntnxoa.image);

      await interaction.editReply({ embeds: [embed1], components: [row] })
    })
  }
}
