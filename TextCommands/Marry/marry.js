const marrySchema = require("../../Databases/Models/marrySchema");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");
const quotes = [
  'How cute!',
  'You look wonderful together!',
  'You guys are adorable!',
  'The perfect pair!',
  'Too cute~!!!',
];
const quotes2 = [
  '（´・｀ ）♡',
  '(๑°꒵°๑)･*♡',
  '♡´･ᴗ･`♡',
  '(๑˃̵ᴗ˂̵)و',
  '(●´Д`●)',
  '(つω`●）',
  '(◕ᴗ◕✿)',
  '(●⌒ｖ⌒●)',
  '(´ ꒳ ` ✿)',
  '(｡･ω･｡)ﾉ♡',
  '(｡ӦｖӦ)♡',
  'OwO',
  '<3',
];

module.exports = {
  name: "marry",
  group: "marry",
  cooldown: 5,
  description: "Cưới vợ",
  usage: "{prefix}marry <mention | id | tên>",
  async execute(client, message, args) {
    if (!args[0]) {
      const data = await marrySchema.findOne({ authorId: message.author.id })
      if (!data) {
        return client.deleteMsg(message, `${client.e.error} Bạn chưa đã cưới ai cả!`, 5000, "reply")
      }
      else {
        const wife = await client.users.cache.get(data.wifeId)
        const husband = await client.users.cache.get(data.husbandId)

        let text1 = quotes[Math.floor(Math.random() * quotes.length)] +
          ' ' +
          quotes2[Math.floor(Math.random() * quotes2.length)];

        const date = Math.floor(data.time / 1000)
        const embed = new EmbedBuilder()
          .setAuthor({ name: data.authorId === data.husbandId ? `${husband.username}, bạn vô cùng hạnh phúc khi kết hôn với ${wife.username}` : `${wife.username}, bạn vô cùng hạnh phúc khi kết hôn với ${husband.username}`, iconURL: data.authorId === data.husbandId ? husband.displayAvatarURL({ dynamic: true }) : wife.displayAvatarURL({ dynamic: true }) })
          .setDescription(`💍 Hai bạn đã kết hôn với nhau <t:${date}:R>`)
          .setColor("#FFD5D1")
          .setImage("https://media.discordapp.net/attachments/1033356333094809600/1140589851855560764/DM3k.gif")
          .setThumbnail(data.authorId === data.husbandId ? wife.displayAvatarURL() : husband.displayAvatarURL())
          .setFooter({ text: text1, iconURL: `https://cdn.discordapp.com/emojis/1140718628564631704.gif?size=96&quality=lossless` })
          .setTimestamp();

        await message.channel.send({ embeds: [embed] })
      }
    }
    else {
      const wifeMention = await client.getUser(message, args.join(" "), false)
      if (!wifeMention) return client.deleteMsg(message, `${client.e.error} Vui lòng đề cập một người dùng hợp lệ!`, 5000, "reply")
      if (wifeMention.user.id === message.author.id) return client.deleteMsg(message, `${client.e.error} Sao bạn lại muốn cưới bản thân mình?!`, 5000, "reply")
      if (wifeMention.user.bot) return client.deleteMsg(message, `${client.e.error} Sao bạn lại muốn cầu hôn một con bot?!`, 5000, "reply")
      const husbandData = await marrySchema.findOne({ authorId: message.author.id })
      if (husbandData) {
        return client.deleteMsg(message, `${client.e.error} Việt Nam không có chế độ đa thê đâu mà bạn muốn lấy thêm người khác?`, 5000, "reply")
      }
      const wifeData = await marrySchema.findOne({ authorId: wifeMention.user.id })
      if (wifeData) {
        if (wifeData.husbandId === message.author.id || wifeData.wifeId === message.author.id) return client.deleteMsg(message, `${client.e.error} Bạn đã cưới người này rồi mà!`, 5000, "reply");
        return client.deleteMsg(message, `${client.e.error} Người ta đã có đôi rồi bạn còn muốn làm kẻ thứ ba hả?`, 5000, "reply")
      }
      else {
        const button1 = new ButtonBuilder()
          .setCustomId("marry_accept")
          .setStyle(ButtonStyle.Success)
          .setLabel("Đồng Ý");

        const button2 = new ButtonBuilder()
          .setCustomId("marry_deny")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Từ Chối");

        const row = new ActionRowBuilder().addComponents(button1, button2);

        const reply = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("👰 ・Cầu hôn")
              .setDescription(`**${wifeMention}, Con có đồng ý muốn lấy ${message.member} không?**`)
              .setColor(client.c.fvr)
          ],
          components: [row]
        })
        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
        collector
          .on("collect", async (interaction) => {
            if (interaction.member.id !== wifeMention.user.id) return;
            if (interaction.customId === "marry_accept") {
              await interaction.deferUpdate();
              button1.setDisabled(true)
              button2.setDisabled(true)

              let hbData = new marrySchema({
                authorId: message.author.id,
                husbandId: message.author.id,
                wifeId: wifeMention.user.id,
                time: Date.now()
              })
              let wfData = new marrySchema({
                authorId: wifeMention.user.id,
                husbandId: message.author.id,
                wifeId: wifeMention.user.id,
                time: Date.now()
              })
              await hbData.save()
              await wfData.save()

              await interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("👰 ・Cầu hôn")
                    .setDescription(`**Xin chúc mừng cho đôi uyên ương ${wifeMention} và ${message.member} đã thành đôi!**`)
                    .setColor(client.c.fvr)
                    .setTimestamp(Date.now())
                ],
                components: [row]
              })
            }
            if (interaction.customId === "marry_deny") {
              await interaction.deferUpdate();

              button1.setDisabled(true)
              button2.setDisabled(true)
              await interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("👰 ・Cầu hôn")
                    .setDescription(`**Eo ơi ${message.member}, cái đồ cầu hôn bị từ chối!**`)
                    .setColor(client.c.red)
                    .setTimestamp(Date.now())
                ],
                components: [row]
              })
            }
          })
          .on("end", async () => {
            button1.setDisabled(true)
            button2.setDisabled(true)
            await reply.edit({
              components: [row]
            })
          })
      }
    }
  },
};