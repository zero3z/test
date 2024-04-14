const maxBet = 100000;
const spin = "<a:coinflip:1142492630006104165>";
const heads = "<:dcoin_head:1142493931821613186>";
const tails = "<:dcoin_tail:1142493962544885831>";

module.exports = {
  name: "coinflip",
  group: "economy",
  aliases: ["cf",],
  cooldown: 12,
  description: "Lật đồng xu để nhận được tiền",
  usage: "{prefix}coinflip <h | t> <money>",
  async execute(client, message, args) {
    let bet = 1,
			arg1 = args[0];
		if (!isNaN(arg1)) {
			bet = parseInt(arg1);
			arg1 = args[1];
		} else if (arg1 && arg1.toLowerCase() == 'all') {
			bet = 'all';
			arg1 = args[1];
		} else if (!isNaN(args[1])) {
			bet = parseInt(args[1]);
		} else if (args[1] && args[1].toLowerCase() == 'all') {
			bet = 'all';
		} else if (args.length != 1) {
			return client.deleteMsg(message, `${client.e.error} Vui lòng nhập số tiền hoặc mặt xu hợp lệ!`, 3000, "reply")
		}

		//Get user choice
		let choice = 'h';
		if (arg1 != undefined) arg1 = arg1.toLowerCase();
		if (arg1 == 'heads' || arg1 == 'h' || arg1 == 'head') choice = 'h';
		else if (arg1 == 'tails' || arg1 == 't' || arg1 == 'tail') choice = 't';

		//Final syntax check
		if (bet == 0) {
			return client.deleteMsg(message, `${client.e.error} Bạn không thể đặt cược với số tiền cược là 0 được!`, 3000, "reply")
		} else if (bet < 0) {
			return client.deleteMsg(message, `${client.e.error} Số tiền đặt cược phải là số nguyên dương!`, 3000, "reply")
		} else if (choice == undefined) {
			return client.deleteMsg(message, `${client.e.error} Bạn phải chọn 'heads' hoặc 'tails'`, 3000, "reply")
		}

    const cash = await client.cash(message.author.id);

    if (!cash || cash == 0 || (bet != 'all' && cash < bet)) {
			return client.deleteMsg(message, `${client.e.error} Bạn không có đủ tiền để đặt cược!`, 3000, "reply")
		} else {
      if (bet == 'all') bet = cash;

			if (maxBet && bet > maxBet) {
				bet = maxBet;
			} else if (bet <= 0) {
				return client.deleteMsg(message, `${client.e.error} Bạn không có đủ tiền để đặt cược!`, 3000, "reply")
			}

		
      let rand = Math.floor(Math.random() * 2) + 1;
			let win = false;
			//tails
			if (rand == 1 && choice == 't') win = true;
			//heads
			else if (rand == 2 && choice == 'h') win = true;
      if (win) {
        await client.congcash(message.author.id, bet)
      } else {
        await client.trucash(message.author.id, bet)
      }
      let text =
				'**' +
				message.author.username +
				'** cược **' +
				client.e.coin +
				' ' +
				bet.toLocaleString("en-us") +
				'** và chọn ' +
				(choice == 'h' ? '**mặt ngửa** ' + heads : '**mặt úp** ' + tails);
			let text2 = text;
			text2 +=
				'\nVà kết quả là ' +
				(win ? (choice == 'h' ? heads : tails) : choice == 'h' ? tails : heads) +
				' Bạn ';
			if (win) text2 += 'đã thắng **' + client.e.coin + ' ' + (bet * 2).toLocaleString("en-us") + '**!!';
			else text2 += 'đã mất sạch... :c';
			text += '\nĐồng xu đang xoay ' + spin;

      let msg = await message.channel.send(text);
      await client.sleep(4000);
      msg.edit(text2)
    }
  }
}