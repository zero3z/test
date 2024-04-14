const emojis = [
  "<:dice1:1138729270596874240>",
  "<:dice2:1138729318273523742>",
  "<:dice3:1138729348506066984>",
  "<:dice4:1138729384497401886>",
  "<:dice5:1138729479573880842>",
  "<:dice6:1138729510997606512>"
];
const tx = "<a:lactaixiu:929744676817338368>";

module.exports = {
  name: "taixiu",
  group: "util",
  aliases: ["tx", "lactx"],
  cooldown: 0,
  description: "Lắc tài xỉu",
  usage: "{prefix}taixiu",
  async execute(client, message, args) {
    if (!message.member.roles.cache.find(r => r.name === "Lắc Tài Xỉu")) return client.deleteMsg(message, `${client.e.error} Bạn phải có role \`Lắc Tài Xỉu\` để có thể sử dụng lệnh này!`, 8000, "reply")
    let r1 = Math.floor(Math.random() * emojis.length);
    let r2 = Math.floor(Math.random() * emojis.length);
    let r3 = Math.floor(Math.random() * emojis.length);
    const diem = (r1 + 1) + (r2 + 1) + (r3 + 1);
    let msg = await message.channel.send(`${tx} ${tx} ${tx}`)
    let msg2 = await message.channel.send("<:dm_uongtra:1141803196944236606> **Đợi xíu để lắc nè**")
    await client.sleep(2000)
    msg.edit(`${emojis[r1]} ${tx} ${tx}`)
    await client.sleep(2000)
    msg.edit(`${emojis[r1]} ${emojis[r2]} ${tx}`)
    await client.sleep(1500)
    msg.edit(`${emojis[r1]} ${emojis[r2]} ${emojis[r3]}`)
    let taixiu
    if (diem >= 1 && diem <= 10) {
      taixiu = "Xỉu"
    } else if (diem > 10 && diem <= 18) {
      taixiu = "Tài"
    }
    let chanle = diem % 2 == 0 ? "Chẵn" : "Lẻ"
    msg2.edit(`<a:dm_pinkfire:1141799130805567610> **${diem}・${taixiu}・${chanle}**  <a:dm_pinkfire:1141799130805567610>`)
  }
}