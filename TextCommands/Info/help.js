const { EmbedBuilder } = require("discord.js")
const fs = require("node:fs");

module.exports = {
  name: "help",
  group: "info",
  aliases: [],
  cooldown: 0,
  description: "Xem tất cả những lệnh khả dụng của bot",
  usage: "{prefix}help <tên >",
  bperms: ["EmbedLinks", "AttachFiles"],
  async execute(client, message, args, prefix) {
    const ignoredDir = [
      "Dev"
    ];
    if (!args[0]) {
      const categories = fs.readdirSync("./TextCommands/")
        .filter((dir) => !ignoredDir.includes(dir))
        .map((dir) => {
          const commands = fs.readdirSync(`./TextCommands/${dir}/`).filter((file) => file.endsWith(".js"));
          const cmds = commands
            .map((command) => {
              const file = require(`../../TextCommands/${dir}/${command}`);
              if (!file.hidden) {
                const name = file.name.replace(".js", "");
                return `\`${name}\``;
              }
            })
            .filter((cmd) => cmd !== undefined);

          return {
            name: `<a:dm_luvflower:1142220987560108032> ${dir} [${cmds.length}]`,
            value: cmds.length === 0 ? "In progress." : cmds.join(" "),
          };
        });

      const embed = new EmbedBuilder()
      .setTitle("Danh Sách Lệnh Của DuckMei")
      .setDescription(`Prefix của tớ là ${prefix}`)
      .setColor(client.c.fvr)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(categories)
      .setFooter({ text: "Cảm ơn vì đã sử dụng bot", iconURL: `https://cdn.discordapp.com/emojis/992254651489595492.gif?size=96&quality=lossless` })
      .setTimestamp();
      await message.reply({ embeds: [embed] })
      await message.channel.send(`[Chính sách bảo mật](https://github.com/DuckMei/Privacy-Policy-Bot) & [Điều khoản dịch vụ](https://github.com/DuckMei/ToS-Bot)`)
    }
    else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

      if (!command || command.group === "dev") {
        return client.deleteMsg(message, `${client.e.error} Lệnh không hợp lệ! Sử dụng \`${client.prefix}help\` cho tất cả các lệnh của tớ!`, 5000, "reply")
      }
      const embed = new EmbedBuilder()
      .setTitle(`Tên lệnh: ${command.name}`)
      .setColor("#D2F3C3")
      .addFields(
        {
            name: "Aliases:",
            value: command.aliases
              ? `\`${command.aliases && command.aliases.length > 0 ? command.aliases.join("` `") : 'Không có'}\``
              : "Không có"
          },
          {
            name: "Usage:",
            value: command.usage
              ? `\`${command.usage.replace(/{prefix}/g, client.prefix)}\``
              : `\`${client.prefix}${command.name}\``
          },
          {
            name: "Description:",
            value: command.description
              ? command.description
              : "Không có mô tả cho lệnh này."
          }
      )
      .setFooter({ text: `Được yêu cầu bởi ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp()
      await message.reply({ embeds: [embed] })
    }
  }
}

