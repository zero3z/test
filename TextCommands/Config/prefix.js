const prefixSchema = require("../../Databases/Models/prefixSchema")
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "prefix",
  group: "config",
  aliases: ["pf"],
  cooldown: 5,
  description: "Kiểm tra hoặc thay đổi prefix của bot",
  usage: "{prefix}prefix <prefix mới>",
  uperms: ["Administrator"],
  async execute(client, message, args) {
    let data = await prefixSchema.findOne({
      guildId: message.guild.id,
    })
    
    const newprefix = args[0];
    if (!newprefix) {
      await message.channel.send({ embeds: [
        new EmbedBuilder()
        .setColor(client.c.fvr)
        .setDescription(`***Prefix hiện tại của server là: \`${data.prefix || client.cf.prefix}\`***`)
      ]})
    } else {
      if (newprefix.length > 5) {
        return client.deleteMsg(message, `${client.e.error} Vui lòng không set prefix quá 5 kí tự!`, 5000, "reply")
      }
      if (!data) {
        data = await prefixSchema.create({
          guildId: message.guild.id,
          prefix: newprefix
        })
        await data.save()
          await message.channel.send({ embeds: [
            new EmbedBuilder()
            .setColor(client.c.green)
            .setDescription(`***${client.e.success} | Đã thay đổi prefix thành: \`${newprefix}\`***`)
          ]})
        
      } 
      else {
        await prefixSchema.findOneAndUpdate({
          guildId: message.guild.id,
        }, {
          prefix: newprefix
        })
        
        await message.channel.send({ embeds: [
          new EmbedBuilder()
          .setColor(client.c.green)
          .setDescription(`***${client.e.success} | Đã thay đổi prefix thành: \`${newprefix}\`***`)
        ]})
      }
    }
  }
}