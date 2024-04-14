const marrySchema = require("../../Databases/Models/marrySchema");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "divorce",
  group: "marry",
  cooldown: 5,
  description: "Li hôn",
  usage: "{prefix}divorce",
  async execute(client, message, args) {
    const data = await marrySchema.findOne({ authorId: message.author.id })
    if (!data) return client.deleteMsg(message, `${client.e.error} Bạn chưa đã cưới ai cả!`, 5000, "reply")

    const wifeid = (data.authorId === data.husbandId) ? data.wifeId : data.husbandId;
    const data2 = await marrySchema.findOne({ authorId: wifeid })

    const button1 = new ButtonBuilder()
      .setCustomId("divorce_accept")
      .setStyle(ButtonStyle.Success)
      .setLabel("Chắc Chắn");

    const button2 = new ButtonBuilder()
      .setCustomId("divorce_deny")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Suy Nghĩ Lại")

    const row = new ActionRowBuilder().addComponents(button1, button2);

    const reply = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("👰・Ly hôn")
          .setDescription(`**${message.author.username}, Con có chắc chắn là muốn chia tay không?**`)
          .setColor(client.c.red)
      ],
      components: [row]
    })
    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
    collector
      .on("collect", async (interaction) => {
        if (interaction.member.id !== message.author.id) return;
        if (interaction.customId === "divorce_accept") {
          await interaction.deferUpdate();
          button1.setDisabled(true)
          button2.setDisabled(true)

          await marrySchema.deleteOne({ authorId: wifeid })
          await marrySchema.deleteOne({ authorId: message.author.id })

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("👰・Ly hôn")
                .setDescription(`**Vậy là kết thúc rồi sao...💔**`)
                .setColor(client.c.red)
            ],
            components: [row]
          })
        }
        if (interaction.customId === "divorce_deny") {
          await interaction.deferUpdate();
          button1.setDisabled(true)
          button2.setDisabled(true)

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("👰・Ly hôn")
                .setDescription(`**Suy nghĩ kĩ lại đi!**`)
                .setColor(client.c.red)
            ],
            components: [row]
          })
        }
      })
  }
}