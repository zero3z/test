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
]
const bc = "<a:lacbaucua:929768889565466634>";

module.exports = {
  name: "baucua",
  group: "util",
  aliases: ["bc", "lacbc", "lacbaucua"],
  cooldown: 0,
  description: "Lắc bầu cua",
  usage: "{prefix}lacbaucua",
  async execute(client, message, args) {
    if (!message.member.roles.cache.find(r => r.name === "Lắc Bầu Cua")) return client.deleteMsg(message, `${client.e.error} Bạn phải có role \`Lắc Bầu Cua\` để có thể sử dụng lệnh này!`, 8000, "reply")
    let r1 = Math.floor(Math.random() * emojis.length);
    let r2 = Math.floor(Math.random() * emojis.length);
    let r3 = Math.floor(Math.random() * emojis.length);

    let msg = await message.channel.send(`${bc} ${bc} ${bc}`)
    let msg2 = await message.channel.send("<:dm_uongtra:1141803196944236606> **Đợi xíu để lắc nè**")
    console.log(`${name[r1]}・${name[r2]}・${name[r3]}`)
    await client.sleep(2000)
    msg.edit(`${emojis[r1]} ${bc} ${bc}`)
    await client.sleep(2000)
    msg.edit(`${emojis[r1]} ${emojis[r2]} ${bc}`)
    await client.sleep(1500)
    msg.edit(`${emojis[r1]} ${emojis[r2]} ${emojis[r3]}`)
    msg2.edit(`<a:dm_pinkfire:1141799130805567610> **${name[r1]}・${name[r2]}・${name[r3]}** <a:dm_pinkfire:1141799130805567610>`)
    
  }
}