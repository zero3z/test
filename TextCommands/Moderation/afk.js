const afkSchema = require('../../Databases/Models/afkSchema');
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "afk",
  group: "moderation",
  aliases: [],
  cooldown: 0,
  description: "Set afk cho bản thân",
  usage: "{prefix}afk <lí do>",
  async execute(client, message, args) {
    const reason = args.join(" ") || "AFK";
    
      let data = await afkSchema.findOne({
      guildId: message.guild.id,
      id: message.author.id
    })
    if (!data) {
      data = new afkSchema({
        GuildId: message.guild.id,
        UserId: message.author.id,
        reason: reason,
        time: Date.now()
      })
      await data.save()

      if (!message.member.displayName.includes(`[AFK] `)) {
        await message.member.setNickname(`[AFK] ` + message.member.displayName).catch(e => { });
      }
      const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag ,iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${message.member} đã set afk! Lí do: ${reason}`)
      .setTimestamp()

      await message.channel.send({ embeds: [embed]})
    }
  }
}