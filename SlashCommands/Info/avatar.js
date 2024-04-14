const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Xem ảnh đại diện của bạn hoặc người khác.",
  grou: "info",
  options: [
    {
      name: "user",
      description: "Người mà bạn muốn xem avatar.",
      type: 6,
      required: false
    }
  ],
  async execute(client, interaction) {
    const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id) || interaction.member;
    
    const res = await client.fetchUser(member.id);

    const button1 = new ButtonBuilder()
      .setCustomId("av")
      .setLabel('Avatar')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const button2 = new ButtonBuilder()
      .setCustomId("sav")
      .setLabel('Server Avatar')
      .setStyle(ButtonStyle.Secondary);

    const button3 = new ButtonBuilder()
      .setCustomId("banner")
      .setLabel('Banner')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button1);

    if (member.avatar) {
      row.addComponents(button2);
    }
    if (res.banner) {
      row.addComponents(button3);
    }

    const embed = new EmbedBuilder()
      .setTitle("Avatar")
      .setColor(member.displayHexColor)
      .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: `Được yêu cầu bởi ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    const reply = await interaction.reply({ embeds: [embed], components: [row] });
    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 });
    collector
      .on("collect", async (interaction) => {
        if (interaction.member.id !== interaction.user.id) return;
        if (interaction.customId === "av") {
          await interaction.deferUpdate();
          embed.setTitle("Avatar").setColor(member.displayHexColor).setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }));

          button1.setDisabled(true).setStyle(ButtonStyle.Primary);
          button2.setDisabled(false).setStyle(ButtonStyle.Secondary);
          button3.setDisabled(false).setStyle(ButtonStyle.Secondary);

          await interaction.editReply({ embeds: [embed], components: [row] });
        }
        if (interaction.customId === "sav") {
          await interaction.deferUpdate();
          embed.setTitle("Server Avatar").setColor(member.displayHexColor).setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }));

          button1.setDisabled(false).setStyle(ButtonStyle.Secondary);
          button2.setDisabled(true).setStyle(ButtonStyle.Primary);
          button3.setDisabled(false).setStyle(ButtonStyle.Secondary);

          await interaction.editReply({ embeds: [embed], components: [row] });
        }
        if (interaction.customId === "banner") {
          await interaction.deferUpdate();
          const ext = res.banner.startsWith("a_") ? ".gif" : ".png";

          embed.setTitle("Banner").setImage(`https://cdn.discordapp.com/banners/${member.user.id}/${res.banner}${ext}?size=4096`);

          button1.setDisabled(false).setStyle(ButtonStyle.Secondary);
          button2.setDisabled(false).setStyle(ButtonStyle.Secondary);
          button3.setDisabled(true).setStyle(ButtonStyle.Primary);

          await interaction.editReply({ embeds: [embed], components: [row] });
        }
      })
      .on("end", async () => {
        button1.setDisabled(true);
        button2.setDisabled(true);
        button3.setDisabled(true);
        await reply.edit({
          content: `Hết thời gian hoạt động!`,
          components: [row]
        })
      })
  }
}