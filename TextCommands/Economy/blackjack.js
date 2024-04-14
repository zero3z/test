const { EmbedBuilder } = require("discord.js")
const client = require("../../index.js");

const maxBet = 100000;
const hitemoji = "👊";
const stopemoji = "🛑";
const checkGame = new Set();

module.exports = {
  name: "blackjack",
  group: "economy",
  aliases: ["bj",],
  cooldown: 12,
  description: "Chơi xì dách",
  usage: "{prefix}blackjack <money>",
  async execute(client, message, args) {
    if (checkGame.has(message.author.id)) {
      return client.deleteMsg(message, `${client.e.error} Vui lòng hoàn thành ván chơi hiện tại của bạn!`, 3000, "reply")
    }
    const playerDeck = [];
    const botDeck = [];
    const hide_deck = [];
    const backcard = client.e.cards.backcard;
    let listofcard = client.e.cards.list;

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
    }

    checkGame.add(message.author.id);
    for (let i = 0; i < 2; i++) {
      playerDeck.push(await randomcard(listofcard));
      listofcard = locbai(listofcard, playerDeck);
      botDeck.push(randomcard(listofcard));
      listofcard = locbai(listofcard, botDeck);
      hide_deck.push(backcard);
    }
    const embed = createembed(message.member.user, amount, createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), createembedfield(hide_deck), "not")

    const msg = await message.channel.send({ embeds: [embed] });
    // check coi có xi dach hoac xi bang
    const player_first = checkautowin(playerDeck);
    if (player_first.check == true) {
      if (player_first.loaiwin == 'xidach') {
        // cong tien thuong
        await client.addcash(message.author.id, amount);
        checkGame.delete(message.author.id);
        const embed1 = createembed(message.member.user, amount.toLocaleString("en-us"), createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), createembedfield(hide_deck), "thang")
        return await msg.edit({ embeds: [embed1] });
      } else if (player_first.loaiwin == 'xibang') {
        // x2 tien thuong
        await client.congcash(message.author.id, amount * 2);
        checkGame.delete(message.author.id);
        const embed1 = createembed(message.member.user, amount.toLocaleString("en-us"), createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), createembedfield(hide_deck), "thangx2");
        return await msg.edit({ embeds: [embed1] });
      }
    }
    else if (checkautowin(botDeck).check == true) {
      await client.trucash(message.author.id, bet);
      checkGame.delete(message.author.id);
      const embed1 = createembed(message.member.user, amount.toLocaleString("en-us"), createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), createembedfield(hide_deck), "thua")
      return await msg.edit({ embeds: [embed1] });
    }
    msg.react(hitemoji);
    msg.react(stopemoji);
    const filter = (reaction, user) => {
      return (reaction.emoji.name === hitemoji || reaction.emoji.name === stopemoji) && user.id === message.author.id;
    };
    const collector = msg.createReactionCollector({ filter, time: 120000 });
    collector.on('collect', async (reaction) => {
      if (reaction.emoji.name === hitemoji) {
        playerDeck.push(await randomcard(listofcard));
        listofcard = locbai(listofcard, playerDeck);
        if (getcardvalue(playerDeck) > 21 || parseInt(getcardvalue(playerDeck).replace(/\*/g, '')) > 21) {
          collector.stop();
          return await stop(message.member.user, listofcard, botDeck, playerDeck, msg, amount, checkGame);
        }
        const emb = createembed(message.member.user, amount.toLocaleString("en-us"), createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), createembedfield(hide_deck), "not");
        await msg.edit({ embeds: [emb] });
      } else if (reaction.emoji.name === stopemoji) {
        collector.stop();
        await stop(message.member.user, listofcard, botDeck, playerDeck, msg, amount, checkGame);
      }
    });
    collector.on('end', async (_, reason) => {
      if (reason == 'time') {
        msg.edit('Trò chơi hết hạn. Bạn sẽ bị trừ tiền.');
        await client.trucash(message.author.id, bet);
      }
      checkGame.delete(message.author.id);
    });
  },
};

async function stop(player, listofcard, botDeck, playerDeck, msg, bet, checkGame) {
  checkGame.delete(player.id);
  while (getcardvalue(botDeck) < 15 || parseInt(getcardvalue(botDeck).replace(/\*/, '')) < 15) {
    botDeck.push(randomcard(listofcard));
    listofcard = locbai(listofcard, botDeck);
  }
  let kind_of_winning;
  let bot_points = getcardvalue(botDeck);
  let user_points = getcardvalue(playerDeck);
  if (isNaN(bot_points)) bot_points = parseInt(bot_points.replace(/\*/, ''));
  if (isNaN(user_points)) user_points = parseInt(user_points.replace(/\*/, ''));
  if (user_points > 21 && bot_points > 21) {
    kind_of_winning = 'hoa';
  } else if (user_points == bot_points) {
    kind_of_winning = 'hoa';
  } else if (user_points > 21) {
    kind_of_winning = 'thua';
    await client.trucash(player.id, bet);
  } else if (bot_points > 21) {
    kind_of_winning = 'thang';
    await client.congcash(player.id, bet);
  } else if (user_points > bot_points) {
    kind_of_winning = 'thang';
    await client.congcash(player.id, bet);
  } else {
    kind_of_winning = 'thua';
    await client.trucash(player.id, bet);
  }
  const emb2 = createembed(player, bet, createembedfield(playerDeck), createembedfield(botDeck), getcardvalue(playerDeck), getcardvalue(botDeck), null, kind_of_winning);
  return await msg.edit({ embeds: [emb2]});
}
function randomcard(listofcard) {
  if (!Array.isArray(listofcard)) return null;
  const num = Math.floor(Math.random() * listofcard.length);
  const cards = listofcard[num];
  return cards;
}
function checkautowin(list) {
  let aces = 0;
  let jqk = 0;
  if (list.length !== 2) return {
    check: false, data: {
      aces: aces, jqk: jqk
    }
  };
  for (let i = 0; i < list.length; i++) {
    if (!isNaN(list[i].slice(2, 3)) && list[i].slice(2, 3) !== '1') continue;
    else if (list[i].slice(2, 3).toLowerCase() == 'a') aces++;
    else if (list[i].slice(2, 3).toLowerCase() == 'j' || list[i].slice(2, 3).toLowerCase() == 'q' || list[i].slice(2, 3).toLowerCase() == 'k' || list[i].slice(2, 3) == '1') jqk++;
  }
  if (aces == 1 && jqk == 1) return { check: true, loaiwin: "xidach", data: { aces: aces, jqk: jqk } };
  else if (aces == 2) return { check: true, loaiwin: "xibang", data: { aces: aces, jqk: jqk } };
  else return { check: false, data: { aces: aces, jqk: jqk } };
}
function getcardvalue(list) {
  let point = 0;
  let aces = 0;
  for (let i = 0; i < list.length; i++) {
    const cardname = list[i].slice(5, 6);
    if (!isNaN(cardname)) {
      switch (parseInt(cardname)) {
        case 1:
          point += 10;
          break;
        default:
          point += parseInt(cardname);
          break;
      }
    } else {
      switch (cardname) {
        case "a":
          aces++;
          break;
        default:
          point += 10;
          break;
      }
    }
  }
  if (aces == 0) return point.toString();
  else {
    for (let y = 0; y < aces; y++) {
      if (point > 10) point++;
      else point += 11;
    }
    return `${point}`;
  }
}
function createembed(nguoichoi, bet, deck_user, deck_bot, nguoichoi_val, bot_val, hidden_deck, end) {
  const embed = new EmbedBuilder()
    .setFooter({ text: "Game đang diễn ra", iconURL: "https://cdn.discordapp.com/emojis/1142888722052956371.gif?size=96&quality=lossless" })
    .setAuthor({ name: `${nguoichoi.username}, bạn đã cược ${bet.toLocaleString("en-us")} để chơi xì dách!`, iconURL: nguoichoi.displayAvatarURL() })
  if (end == 'thang') {
    embed.setColor("#FFEFEF");
    embed.setFooter({ text: `Bạn đã thắng ${bet.toLocaleString("en-us")} carro!`, iconURL: "https://cdn.discordapp.com/emojis/1142888722052956371.gif?size=96&quality=lossless"});
    embed.addFields(
      { name: `Bot: [${bot_val}]`, value: deck_bot },
      { name: `User: [${nguoichoi_val}]`, value: deck_user },
    );
  } else if (end == 'thua') {
    embed.setColor("#FF0000");
    embed.setFooter({ text: `Bạn đã thua ${bet.toLocaleString("en-us")} carro!` , iconURL: "https://cdn.discordapp.com/emojis/1142888722052956371.gif?size=96&quality=lossless"});
    embed.addFields(
      { name: `Bot: [${bot_val}]`, value: deck_bot },
      { name: `User: [${nguoichoi_val}]`, value: deck_user },
    );
  } else if (end == 'hoa') {
    embed.setColor("#D3D3D3");
    embed.setFooter({ text: `Bạn không thắng gì cả!`, iconURL: "https://cdn.discordapp.com/emojis/1142888722052956371.gif?size=96&quality=lossless"});
    embed.addFields(
      { name: `Bot: [${bot_val}]`, value: deck_bot },
      { name: `User: [${nguoichoi_val}]`, value: deck_user },
    );
  } else if (end == 'thangx2') {
    embed.setColor("#FFEFEF");
    embed.setFooter({ text: `Bạn thắng ${(bet * 2).toLocaleString("en-us")} carro!`, iconURL: "https://cdn.discordapp.com/emojis/1142888722052956371.gif?size=96&quality=lossless"});
    embed.addFields(
      { name: `Bot: [${bot_val}]`, value: deck_bot },
      { name: `User: [${nguoichoi_val}]`, value: deck_user },
    );
  } else if (end == 'not') {
    embed.addFields(
      { name: `Bot: [?]`, value: hidden_deck },
      { name: `User: [${nguoichoi_val}]`, value: deck_user },
    );
  }
  return embed;
}
function createembedfield(deck) {
  if (!Array.isArray(deck)) return null;
  let line = "";
  deck.forEach(card => {
    line += card;
  });
  return line;
}
function locbai(listOfCard, deck) {
  if (!Array.isArray(listOfCard) || !Array.isArray(deck)) return null;
  return listOfCard.filter(item => !deck.includes(item));
}