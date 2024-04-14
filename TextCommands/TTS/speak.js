const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require("google-tts-api");


module.exports = {
  name: "speak",
  group: "tts",
  aliases: ["s", "talk"],
  cooldown: 0,
  description: "Cho bot nói trong kênh voice của bạn",
  usage: "{prefix}speak <tin nhắn>",
  bperms: ["Connect", "Speak"],
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel) return client.deleteMsg(message, `${client.e.error} Vui lòng vào kênh thoại để sử dụng lệnh này`, 5000, "reply");

    const string = args.join(" ");
    if (!string) return client.deleteMsg(message, `${client.e.error} Vui lòng nhập tin nhắn để bot nói!`, 5000, "reply");
    if (string.length > 200) return client.deleteMsg(message, `${client.e.error} Vui lòng nhập dưới 200 từ!`, 5000, "reply");

    if (!channel.joinable) return client.deleteMsg(message, `${client.e.error} Bot không vào được phòng của bạn`, 5000, "reply");

    const botchannel = message.guild.members.me.voice.channel;
    if (botchannel) {
      if (botchannel.id !== channel.id) return client.deleteMsg(message, `${client.e.error} Bot đang ở khác kênh thoại với bạn!`, 5000, "reply");
    }

    const audioUrl = getAudioUrl(string, {
      lang: "vi",
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(audioUrl);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    player.play(resource);
    connection.subscribe(player);
    player.on(AudioPlayerStatus.Idle, async () => {
      
    });
  }
}