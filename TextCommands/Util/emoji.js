const {
  parseEmoji,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "emoji",
  async execute(client, message, args) {
    let index = 0;
    const emojiLength = args.length;
    const emoji = args[index];
    if (!emoji) {
      return client.deleteMsg(
        message,
        `${client.e.error} Vui lòng thêm emoji cần phóng to!`,
        5000,
        "reply",
      );
    }
    const custom = await parseEmoji(emoji);
    if (!custom || !custom.id) {
      return client.deleteMsg(
        message,
        `${client.e.error} Vui lòng chọn một emoji phù hợp!`,
        5000,
        "reply",
      );
    }
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Big Emoji!!" })
      .setDescription(`\`${custom.name} ${custom.id}\``)
      .setImage(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
          custom.animated ? "gif" : "png"
        }`,
      )
      .setFooter({
        text: `Trang ${index + 1}/${emojiLength}`,
      });

    const button1 = new ButtonBuilder()
      .setCustomId("back_buttonEmoji")
      .setEmoji("<:back_button:1164742324107087893>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const button2 = new ButtonBuilder()
      .setCustomId("foward_buttonEmoji")
      .setEmoji("<:forward_button:1164742350933864448>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(index + 1 >= emojiLength);

    const row = new ActionRowBuilder().addComponents(button1, button2);

    const reply = await message.reply({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    collector
      .on("collect", async (interaction) => {
        if (interaction.member.id !== message.author.id) return;
        await interaction.deferUpdate();
        index += interaction.customId === "back_buttonEmoji" ? -1 : 1;
        button1.setDisabled(index === 0);
        button2.setDisabled(index + 1 >= emojiLength);

        const nemoji = args[index];
        const ncustom = await parseEmoji(nemoji);

        const embed1 = new EmbedBuilder()
          .setAuthor({ name: "Big Emoji!!" })
          .setDescription(`\`${ncustom.name} ${ncustom.id}\``)
          .setImage(
            `https://cdn.discordapp.com/emojis/${ncustom.id}.${
              ncustom.animated ? "gif" : "png"
            }`,
          )
          .setFooter({
            text: `Trang ${index + 1}/${emojiLength}`
          });

        await interaction.editReply({ embeds: [embed1], components: [row] });
      })
      .on("end", async () => {
        button1.setDisabled(true);
        button2.setDisabled(true);
        await reply.edit({
          components: [row],
        });
      });
  },
};
