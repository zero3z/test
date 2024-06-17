const emojis = [
  "<:1nut:1252286075964227635>",
  "<:2nut:1252286118876020828>",
  "<:3nut:1252286159707574342>",
  "<:4nut:1252286197292601405>",
  "<:5nut:1252286245178966056>",
  "<:6nut:1252286282042835014>"
];
const tx = "<a:doxucxac:1252286352377118892>";

module.exports = {
  name: "taixiu",
  group: "util",
  aliases: ["tx", "lactx"],
  cooldown: 0,
  description: "Lắc tài xỉu",
  usage: "{prefix}taixiu",
  async execute(client, message, args) {
    if (!message.member.roles.cache.find(r => r.name === "Lắc Tài Xỉu")) {
      return client.deleteMsg(message, `${client.e.error} Bạn phải có role \`Lắc Tài Xỉu\` để có thể sử dụng lệnh này!`, 8000, "reply");
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

    // Tính điểm
    const diem = emojis.indexOf(r1) + 1 + emojis.indexOf(r2) + 1 + emojis.indexOf(r3) + 1;

    let msg = await message.channel.send(`${tx} ${tx} ${tx}`);
    let msg2 = await message.channel.send("<a:uongtra:1252227009611042826> **Đợi xíu để lắc nè**");

    await client.sleep(2000);
    msg.edit(`${r1} ${tx} ${tx}`);
    await client.sleep(2000);
    msg.edit(`${r1} ${r2} ${tx}`);
    await client.sleep(1500);
    msg.edit(`${r1} ${r2} ${r3}`);

    let taixiu;
    if (diem >= 1 && diem <= 10) {
      taixiu = "Xỉu";
    } else if (diem > 10 && diem <= 18) {
      taixiu = "Tài";
    }

    let chanle = diem % 2 === 0 ? "Chẵn" : "Lẻ";
    msg2.edit(`<a:money:1246808971499540490> **${diem}・${taixiu}・${chanle}**  <a:money:1246808971499540490>`);
  }
};
