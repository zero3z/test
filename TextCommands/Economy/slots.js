const maxBet = 100000;
const slots = [
  "<:_grape:1142239813844615191>",
  "<:_lemon:1142239846514036827>",
  "<:_cherry:1142239719711838248>",
  "<:_watermelon:1142239772065148938>",
  "<:_cocktail:1142239943951921284>",
  "<:_seven:1142239902822584340>",
];
const moving = "<a:slots:1142235916447006771>";

module.exports = {
  name: "slots",
  group: "economy",
  aliases: ["sl", "slot"],
  cooldown: 12,
  description: "Cược tiền cùng với máy đánh bạc nào",
  usage: "{prefix}slots <money>",
  async execute(client, message, args) {
    let amount = 0;
    let all = false;
    if (args.length == 0) amount = 1;
    else if (args.length == 1 && !isNaN(args[0])) amount = parseInt(args[0]);
    else if (args.length == 1 && args[0] == "all") all = true;
    else {
      return client.deleteMsg(message, `${client.e.error} Vui lòng nhập số tiền hợp lệ`, 3000, "reply")
    }

    if (amount == 0 && !all) {
      return client.deleteMsg(message, `${client.e.error} Bạn không thể đặt cược với số tiền cược là 0 được!`, 3000, "reply")
    }
    else if (amount < 0) {
      return client.deleteMsg(message, `${client.e.error} Số tiền đặt cược phải là số nguyên dương!`, 3000, "reply")
    }

    let cash = await client.cash(message.author.id);
    if (all && cash) amount = cash;
    if (maxBet && amount > maxBet) amount = maxBet;
    if (!cash || cash < amount || cash <= 0) {
      return client.deleteMsg(message, `${client.e.error} Bạn không có đủ tiền để đặt cược`, 3000, "reply")
    } else {
      const winConditions = [
        { probability: 30, multiplier: 1, slotIndex: 0 },
        { probability: 20, multiplier: 2, slotIndex: 1 },
        { probability: 5, multiplier: 3, slotIndex: 2 },
        { probability: 2.5, multiplier: 4, slotIndex: 3 },
        { probability: 1, multiplier: 10, slotIndex: 4 },
        { probability: 1, multiplier: 7, slotIndex: 5 },
      ];

      let rslots = [];
      let win = false;
      let x = 0;
      let chosenCondition = null;
      const rand = Math.random() * 100;

      for (const condition of winConditions) {
        if (rand <= condition.probability) {
          win = true;
          x = amount * condition.multiplier;
          chosenCondition = condition;
          break;
        }
      }

      if (!win) {
        const slotIndices = Array.from({ length: 3 }, () => Math.floor(Math.random() * slots.length));
        rslots = slotIndices.map((index) => slots[index]);
      } else {
        rslots = [slots[chosenCondition.slotIndex], slots[chosenCondition.slotIndex], slots[chosenCondition.slotIndex]];
      }

      let winmsg =
        !win ? " và còn đúng cái nịt... :(" : `và đã thắng ${client.e.coin}` + `**${x.toLocaleString("en-us")}**`;
      if (!win) await client.trucash(message.author.id, parseInt(amount))
      else await client.congcash(message.author.id, parseInt(x));
      let msg = await message.channel.send(`\`___SLOTS___\`
  ${moving} | ${moving} | ${moving} ${message.author.username} đã đặt ${client.e.coin} **${amount.toLocaleString('en-us')}**
\`|         |\`
\`|         |\``);
      await client.sleep(1200);
      msg.edit(`\`___SLOTS___\`
  ${rslots[0]} | ${moving} | ${moving} ${message.author.username} đã đặt ${client.e.coin} **${amount.toLocaleString('en-us')}**
\`|         |\`
\`|         |\``);
      await client.sleep(1200)
      msg.edit(`\`___SLOTS___\`
  ${rslots[0]} | ${moving} | ${rslots[2]} ${message.author.username} đã đặt ${client.e.coin} **${amount.toLocaleString('en-us')}**
\`|         |\`
\`|         |\``);
      await client.sleep(1000);
      msg.edit(`\`___SLOTS___\`
  ${rslots[0]} | ${rslots[1]} | ${rslots[2]} ${message.author.username} đã đặt ${client.e.coin} **${amount.toLocaleString('en-us')}**
\`|         |\` ${winmsg}
\`|         |\``)
    }
  }
}