const fs = require("node:fs");
const { 
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder 
} = require("discord.js");

module.exports = {
  name: "newhelp",
  group: "dev",
  async execute(client, message, args) {
    const ignoredDir = ["Dev"];
    const dirEmoji = {
      Emotes: '<:activity:1021048794856554586>',
      Info: '<:info:1021047164660613293>',
      Moderation: '<:moderation:1026451749843767407>',
      Soundboard: '<:soundboard:1026451752519741470>',
      TTS: '<:action:1021047166761971742>',
      Util: '<:toolbox:982959937590288384>'
    };
    if (!args[0]) {
      const categories = fs.readdirSync("./TextCommands/")
        .filter((dir) => !ignoredDir.includes(dir))
        .map((dir) => {
          const commands = client.commands.filter((cmd) => cmd.group === dir.toLowerCase())
            .map((cmd) => {
              return {
                name: cmd.name,
                description: cmd.description
              }
            })

          return {
            directory: dir,
            commands: commands,
          }
        })
      const embed = new EmbedBuilder()
        .setTitle("Danh Sách Lệnh Của DuckMei")
        .setDescription(`Prefix của tớ là ${client.cf.prefix}`)
        .setColor("#FFD5D1")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setTimestamp()

      const select = new StringSelectMenuBuilder()
        .setCustomId("help")
        .setPlaceholder("Lựa chọn group")
        .addOptions(
          categories.map((cmd) => {
            return {
              label: cmd.directory,
              value: cmd.directory,
              emoji: dirEmoji[cmd.directory]
            }
          })
        )

      const row = new ActionRowBuilder().addComponents(select)

      const reply = await message.reply({ embeds: [embed], components: [row] })

      const collector = reply.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 300000 });

      collector.on("collect", async (interaction) => {
        if (interaction.member.id !== message.author.id) return;
        await interaction.deferUpdate();
        const [directory] = interaction.values;
        const category = categories.find((x) => x.directory === directory)

        const categoryEmbed = new EmbedBuilder()
          .setTitle(`${dirEmoji[directory]} ${directory}`)
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: category,
                value: `\`${cmd.name}\``,
                inline: true
              }
            })
          )
        interaction.editReply({ embeds: [categoryEmbed] })
      })
    }
    else {

    }
  }
}