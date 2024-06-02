const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "emoji",
  async execute(client, message, args) {
    let text = args.join(" ");
    let emojis = parseIDs(text);

    if (emojis.length === 0) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng thêm emoji cần phóng to!`, 5000, "reply");
    }

    let index = 0;

    const createEmbed = (emoji, pageIndex) => new EmbedBuilder()
      .setAuthor({ name: "Emoji phóng to", url: emoji.url, iconURL: message.author.displayAvatarURL() })
      .setDescription(`\`${emoji.name} ${emoji.id}\``)
      .setImage(emoji.url)
      .setFooter({ text: `Trang ${pageIndex + 1}/${emojis.length}` });

    const createButtons = (pageIndex) => new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back_buttonEmoji")
        .setEmoji("<:back_button:1164742324107087893>")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageIndex === 0),
      new ButtonBuilder()
        .setCustomId("forward_buttonEmoji")
        .setEmoji("<:forward_button:1164742350933864448>")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageIndex + 1 >= emojis.length)
    );

    const embed = createEmbed(emojis[index], index);
    const row = createButtons(index);

    const reply = await message.reply({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.member.id !== message.author.id) return;
      await interaction.deferUpdate();
      index += interaction.customId === "back_buttonEmoji" ? -1 : 1;
      const newEmbed = createEmbed(emojis[index], index);
      const newRow = createButtons(index);
      await interaction.editReply({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on("end", async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("back_buttonEmoji")
          .setEmoji("<:back_button:1164742324107087893>")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("forward_buttonEmoji")
          .setEmoji("<:forward_button:1164742350933864448>")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );
      await reply.edit({ components: [disabledRow] });
    });
  },
};

function parseIDs(text) {
  const emojis = [];
  const parsedEmojis = text.match(/<[as]?:[a-z0-9_ ]+:[0-9]+>/gi);

  parsedEmojis.forEach(emoji => {
    const id = emoji.match(/:[0-9]+>/gi)[0].slice(1, -1);
    const name = emoji.match(/:[a-z0-9_]+:/gi)[0].slice(1, -1);
    const gif = emoji.startsWith('<a:');
    const url = `https://cdn.discordapp.com/emojis/${id}.${gif ? "gif" : "png"}`;
    emojis.push({ name, id, gif, url });
  });

  return emojis;
}
