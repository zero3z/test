const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "emotes",
  description: "Tương tác với người dùng khác",
  options: [
    {
      name: "bite",
      description: "Cắn một ai đó",
      type: 1,
      options: [
        {
          name: "user",
          description: "Người mà bạn muốn tương tác",
          type: 6,
          required: true
        }
      ]
    },
    {
      name: "cringe",
      description: "Khinh bỉ một ai đó",
      type: 1,
      options: [
        {
          name: "user",
          description: "Người mà bạn muốn tương tác",
          type: 6,
          required: true
        }
      ]
    },
  ],
  async execute(client, interaction) {
    const sub = interaction.options.getSubcommand()
    const response = await axios.get(`https://api.waifu.pics/sfw/${sub}`);
    const image = response.data?.url;
    if (sub === "bite") {
      const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id)
      if (!member) {
        return interaction.reply({
          content: `${client.e.error} Không thể tìm thấy người dùng này!`,
          ephemeral: true
        })
      }
      else if (member.id === interaction.user.id) {
        return interaction.reply({
          content: `${client.e.error} Bạn không thể cắn chính mình!`,
          ephemeral: true
        })
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} đã cắn ${member.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setColor(client.c.fvr)
        .setImage(image)
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
    }
    if (sub === "cringe") {
      const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id)
      if (!member) {
        return interaction.reply({
          content: `${client.e.error} Không thể tìm thấy người dùng này!`,
          ephemeral: true
        })
      }
      else if (member.id === interaction.user.id) {
        return interaction.reply({
          content: `${client.e.error} Tại sao bạn lại tự khinh bỉ chính mình?`,
          ephemeral: true
        })
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username} cảm thấy khinh bỉ ${member.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setColor(client.c.fvr)
        .setImage(image)
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
    }
  }
}

/* {

},
{

},
{

},
{

},
{

},
{

},
{

},
{

},
{

},
{

},
{

} */