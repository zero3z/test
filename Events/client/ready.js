const { ActivityType } = require("discord.js")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
    activities: [
      {
        name: `Bé Bún`,
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/lookinsomething"
      }
    ]
  })
  return console.log(`✅ Đăng Nhập Thành Công Vào ${client.user.tag}`.bold.brightBlue);
  }
}
