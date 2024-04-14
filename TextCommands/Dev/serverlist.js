const { EmbedBuilder } = require("discord.js")

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
}