module.exports = {
  name: "eval",
  group: "dev",
  aliases: [],
  cooldown: 0,
  description: "Eval",
  usage: "{prefix}eval",
  async execute(client, message, args) {
    const { EmbedBuilder } = require("discord.js");
    const code = args.join(" ").replace(/```/g, "");
    let evaled = eval(code);
    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);
    const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) })
      .addFields(
        { name: "**Input**", value: `\`\`\`js\n${code}\n\`\`\`` },
        { name: "**Output**", value: `\`\`\`js\n${evaled}\n\`\`\`` }
      );
    await message.channel.send({ embeds: [embed] });
  },
};