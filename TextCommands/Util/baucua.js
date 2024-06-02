const emojis = [
  "<:tom:1138557841100255242>",
  "<:cua:1138557736620150895>",
  "<:ca:1138558974837411870>",
  "<:nai:1138557887900303400>",
  "<:ga:1138558073716350997>",
  "<:bau:1138557973170499584>"
];
const name = [
  "Tôm",
  "Cua",
  "Cá",
  "Nai",
  "Gà",
  "Bầu"
];
const bc = "<a:lacbaucua:929768889565466634>";

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

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Xáo trộn mảng emojis
    let shuffledEmojis = shuffle([...emojis]);
    let r1 = shuffledEmojis[0];
    let r2 = shuffledEmojis[1];
    let r3 = shuffledEmojis[2];

    let msg = await message.channel.send(`${bc} ${bc} ${bc}`);
    let msg2 = await message.channel.send("<:dm_uongtra:1141803196944236606> **Đợi xíu để lắc nè**");
    console.log(`${name[emojis.indexOf(r1)]}・${name[emojis.indexOf(r2)]}・${name[emojis.indexOf(r3)]}`);

    await client.sleep(2000);
    msg.edit(`${r1} ${bc} ${bc}`);
    await client.sleep(2000);
    msg.edit(`${r1} ${r2} ${bc}`);
    await client.sleep(1500);
    msg.edit(`${r1} ${r2} ${r3}`);
    msg2.edit(`<a:dm_pinkfire:1141799130805567610> **${name[emojis.indexOf(r1)]}・${name[emojis.indexOf(r2)]}・${name[emojis.indexOf(r3)]}** <a:dm_pinkfire:1141799130805567610>`);
  }
};
