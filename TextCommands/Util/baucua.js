const emojis = [
  "<:tom:1252283660074352640>",
  "<:cua:1252283702671839374>",
  "<:ca:1252283746640728074>",
  "<:nai:1252283822620414015>",
  "<:ga:1252283864202870905>",
  "<:bau:1252283909127798905>"
];
const name = [
  "Tôm",
  "Cua",
  "Cá",
  "Nai",
  "Gà",
  "Bầu"
];
const bc = "<a:lac:1252285318388781096>";

module.exports = {
  name: "baucua",
  group: "util",
  aliases: ["bc", "lacbc", "lacbaucua"],
  cooldown: 0,
  description: "Lắc bầu cua",
  usage: "{prefix}lacbaucua",
  async execute(client, message, args) {
    if (!message.member.roles.cache.find(r => r.name === "Lắc Bầu Cua")) {
      return client.deleteMsg(message, `${client.e.error} Bạn phải có role \`Lắc Bầu Cua\` để có thể sử dụng lệnh này!`, 8000, "reply");
    }

    // Hàm xáo trộn mảng
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Xáo trộn mảng emojis
    let shuffledEmojis = shuffle([...emojis]);

    // Chọn ngẫu nhiên hai phần tử từ mảng đã xáo trộn
    let r1 = shuffledEmojis[Math.floor(Math.random() * shuffledEmojis.length)];
    let r2 = shuffledEmojis[Math.floor(Math.random() * shuffledEmojis.length)];
    // Chọn ngẫu nhiên phần tử thứ ba từ toàn bộ mảng gốc
    let r3 = emojis[Math.floor(Math.random() * emojis.length)];

    let msg = await message.channel.send(`${bc} ${bc} ${bc}`);
    let msg2 = await message.channel.send("<a:uongtra:1252227009611042826> **Đợi xíu để lắc nè**");
    console.log(`${name[emojis.indexOf(r1)]}・${name[emojis.indexOf(r2)]}・${name[emojis.indexOf(r3)]}`);

    await client.sleep(2000);
    msg.edit(`${r1} ${bc} ${bc}`);
    await client.sleep(2000);
    msg.edit(`${r1} ${r2} ${bc}`);
    await client.sleep(1500);
    msg.edit(`${r1} ${r2} ${r3}`);
    msg2.edit(`<a:money:1246808971499540490> **${name[emojis.indexOf(r1)]}・${name[emojis.indexOf(r2)]}・${name[emojis.indexOf(r3)]}** <a:money:1246808971499540490>`);
  }
};
