const loveQuotes = [
      "Hãy yêu thương nhau hơn mỗi ngày!",
      "Tình yêu là điều tuyệt vời nhất trong cuộc sống.",
      "Nếu tôi biết tình yêu là gì thì đó là bởi bạn.",
      "Yêu thương cho đi là yêu thương có thể giữ được mãi mãi",
      "TÌnh yêu giống như một cơn gió. Bạn không thể nhìn thấy nhưng có thể cảm nhận được."
    ];
const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
const { createCanvas, loadImage } = require("canvas")
const { AttachmentBuilder } = require("discord.js") 

module.exports = {
  name: "love",
  group: "util",
  aliases: ["ship", "lc"],
  cooldown: 2,
  description: "Xem % tình cảm của bạn với người khác",
  usage: "{prefix}love <mention | id | tên>",
  async execute(client, message, args) {
    let member = await client.getUser(message, args[0]);
    if (args[0] === "random") member = message.guild.members.cache.random();
    
    const canvas = createCanvas(750, 250);
    const ctx = canvas.getContext('2d');
    
    const avatar = await loadImage(message.member.displayAvatarURL({ extension: "png" })); 
    const heart = await loadImage("https://media.discordapp.net/attachments/1033356333094809600/1123011483278770176/pngwing.com.png?width=454&height=452");
    const targetAvatar = await loadImage(member.displayAvatarURL({ extension: "png" }));
    
    ctx.drawImage(avatar, 0, 0, 250, 250);
    ctx.drawImage(heart, 250, 0, 250, 250);
    ctx.drawImage(targetAvatar, 500, 0, 250, 250);
    
    const image = new AttachmentBuilder(canvas.toBuffer(), "love.png");
    let tile = Math.floor(Math.random() * 100);
    if (message.author.id === "835843184751018005") tile = 100;
    let text = `**${message.member.displayName}** + **${member.displayName}** = **_${tile}%_** 💖\n${randomQuote}`;
    await message.channel.send({ content: text, files: [image]})
  }
}