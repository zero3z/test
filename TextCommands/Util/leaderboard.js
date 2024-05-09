const moneySchema = require("../../Databases/Models/moneySchema");
const praySchema = require("../../Databases/Models/praySchema");
const dailySchema = require("../../Databases/Models/dailySchema");
const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "leaderboard",
  group: "util",
  aliases: ["lb", "top"],
  cooldown: 5,
  description: "Xem bảng xếp hạng",
  usage: "{prefix}leaderboard <cash | pray | daily>",
  async execute(client, message, args) {
    let globala = false;

    let money = false;
    let luck = false;
    let daily = false;

    let invalid = false;
    let count = 5;

    for (let i = 0; i < args.length; i++) {
      if (!money && !luck && !daily) {
        if (
          args[i] === 'carro' ||
          args[i] === 'money' ||
          args[i] === 'm' ||
          args[i] === 'c' ||
          args[i] === 'cash'
        )
          money = true;
        else if (args[i] === 'luck' || args[i] === 'pray') luck = true;
        else if (args[i] === 'daily') daily = true;
        else if (!isNaN(args[i])) count = parseInt(args[i]);
        //else if (args[i] === 'global' || args[i] === 'g') globala = true;
        else invalid = true;
      }
      //else if (args[i] === 'global' || args[i] === 'g') globala = true;
      else if (!isNaN(args[i])) count = parseInt(args[i]);
      else invalid = true;
    }
    if (invalid) {
      return client.deleteMsg(message, `${client.e.error} Không thể tìm thấy bảng xếp hạng này!`, 3000, "reply")
    } else {
      if (money) {
        let data = await moneySchema.find().exec();

        data.sort((a, b) => {
          return b.moneys - a.moneys
        })
        const position = data.findIndex(i => i.id === message.author.id) + 1;
        if (count > data.length) count = data.length;
        else if (count > 25) count = 25;
        else if (count < 1) count = 5;
        let msg = ``;
        let ids = [];
        let money = [];
        for (f in data) {
          let o = data[f];
          ids[f] = o.id;
          money[f] = o.moneys;         
        }
        for (let i = 0; i < count; i++) {
          let userid = ids[i];
          let moneys = money[i];
          let members = client.users.cache.get(userid);
          if (!members) continue;
          msg += `\`[${i + 1}]\` ${members.username} - ${client.e.coin} **${parseInt(moneys).toLocaleString('En-Us')} Carro**\n`
        }
        const embed = new EmbedBuilder()
          .setTitle(`<a:dm_cupvang:1141727918377160704> Top ${count} Bảng Xếp Hạng Carro Hàng Đầu`)
          .setColor("#FFD5D1")
          .setDescription(msg)
          .setFooter({ text: `Bạn xếp hạng thứ #${position}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        await message.channel.send({ embeds: [embed] })
      }
      //else if (luck) 
      //else if (daily) 
    }
  },
};