const autoresponsesSchema = require("../../Databases/Models/autoresponsesSchema");
const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "autoresponder",
  group: "util",
  aliases: ["ar"],
  cooldown: 0,
  description: "",
  usage: "{prefix}autoresponder <add> <cmd> | <reply>",
  uperms: [],
  async execute(client, message, args) {
    if (args[0] === "add" || args[0] === "+") {
      if (!message.member.permissions.has("Administrator")) {
        if (message.author.id !== "797345693031071774") {
          return client.deleteMsg(message, `${client.e.error} Bạn cần có quyền \`Người Quản Lý\` để có thể sử dụng lệnh này`, 5000, "reply")
        }
      }
      const content = args.slice(1).join(" ").split("|");
      const trigger = content[0].trim().toLowerCase();
      const reply = content[1].trim();

      const data = await autoresponsesSchema.findOne({
        guildId: message.guild.id,
        trigger: trigger
      })
      if (!data) {
        let newdata = new autoresponsesSchema({
          guildId: message.guild.id,
          matchmode: "exact",
          trigger: trigger,
          reply: reply
        })
        await newdata.save()

        const embed = new EmbedBuilder()
          .setAuthor({ name: "Preview Autoresponder", iconURL: message.guild.iconURL() })
          .setColor(client.c.fvr)
          .addFields(
            { name: "Trigger", value: newdata.trigger },
            { name: "Match Mode", value: newdata.matchmode },
            { name: "Reply", value: newdata.reply },
            { name: "Raw Reply", value: `\`${newdata.reply}\`` }
          )
        await message.channel.send({ embeds: [embed] })
      } else {
        client.deleteMsg(message, `${client.e.error} Tag đã tồn tại`, 5000, "reply");
      }
    }
    if (args[0] === "delete" || args[0] === "remove" || args[0] === "-") {
      if (!message.member.permissions.has("Administrator")) {
        return client.deleteMsg(message, `${client.e.error} Bạn cần có quyền \`Người Quản Lý\` để có thể sử dụng lệnh này`, 5000, "reply")
      }
      const trigger = args.slice(1).join(" ");

      const data = await autoresponsesSchema.findOne({
        guildId: message.guild.id,
        trigger: trigger
      })
      if (data) {
        await data.deleteOne({ trigger: trigger });
        await message.reply(`Đã xóa thành công tag \`${trigger}\``);
      } else {
        client.deleteMsg(message, `${client.e.error} Tag này không tồn tại!`, 5000, "reply");
      }
    }
    if (args[0] === "show" || args[0] === "list") {
      if (!args[1]) {
        const data = await autoresponsesSchema.find({ guildId: message.guild.id }).exec()
        let lb = data.map(e => `${e.trigger}`)
        const embed = new EmbedBuilder()
          .setAuthor({ name: `${message.guild.name} Autoresponders`, iconURL: message.guild.iconURL({ dynamic: true }) })

          .setDescription(`${lb.length > 0 ? lb.join("\n") : `${client.e.error} Có vẻ server chưa đã tạo tag nào cả, vui lòng tạo tag để có thể xem danh sách!`}`)
        await message.channel.send({ embeds: [embed] })
      } else {
        const trigger = args.slice(1).join(" ");
        const data = await autoresponsesSchema.findOne({
          guildId: message.guild.id,
          trigger: trigger
        })
        if (data) {
          const embed = new EmbedBuilder()
            .setAuthor({ name: "Preview Autoresponder", iconURL: message.guild.iconURL() })
            .setColor(client.c.fvr)
            .addFields(
              { name: "Trigger", value: data.trigger },
              { name: "Match Mode", value: data.matchmode },
              { name: "Reply", value: data.reply },
              { name: "Raw Reply", value: `\`${data.reply}\`` }
            )
          await message.channel.send({ embeds: [embed] })
        } else {
          client.deleteMsg(message, `${client.e.error} Không thể tìm thấy tag này, vui lòng thêm tag hợp lệ!`, 5000, "reply")
        }
      }
    }
    if (args[0] === "editmatchmode" || args[0] === "editmm") {
      const content = args.slice(1).join(" ").split("|");
      const trigger = content[0].trim().toLowerCase();
      const matchmode = content[1].trim().toLowerCase();

      const data = await autoresponsesSchema.findOne({
        guildId: message.guild.id,
        trigger: trigger
      })
      if (!data) {
        return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy tag này, vui lòng thêm tag hợp lệ!`, 5000, "reply")
      } else {
        console.log(matchmode)
        if (matchmode === "includes" || matchmode === "exact" || matchmode === "startswith" || matchmode === "endswith") {
          let newdata = await autoresponsesSchema.findOneAndUpdate({
            guildId: message.guild.id,
            trigger: trigger,
          }, {
            matchmode: matchmode
          })

          const embed = new EmbedBuilder()
            .setAuthor({ name: "Preview Autoresponder", iconURL: message.guild.iconURL() })
            .setColor(client.c.fvr)
            .addFields(
              { name: "Trigger", value: newdata.trigger },
              { name: "Match Mode", value: matchmode },
              { name: "Reply", value: newdata.reply },
              { name: "Raw Reply", value: `\`${newdata.reply}\`` }
            )
          await message.channel.send({ embeds: [embed] })
        } else {
          return client.deleteMsg(message, `${client.e.error} Vui lòng chọn cách reply hợp lệ: \`exact\`, \`startswith\`, \`endswith\`, \`includes\``, 5000, "reply")
        }
      }

    }
  }
}