const { Collection } = require("discord.js");
const prefixSchema = require("../../Databases/Models/prefixSchema");
const afkSchema = require("../../Databases/Models/afkSchema");
const autoresponderSchema = require("../../Databases/Models/autoresponsesSchema");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (!message.guild || message.author.bot) return;
    
    const dataAfk = await afkSchema.findOne({
      GuildId: message.guild.id,
      UserId: message.author.id   
    });
    if (dataAfk) {
      await dataAfk.deleteOne();
      client.deleteMsg(message, `**${message.author}**, Bạn đã thoát afk`, 5000);

      if (message.member.displayName.startsWith("[AFK] ")) {
        const name = message.member.displayName.replace("[AFK] ", "");
        await message.member.setNickname(name).catch(e => { });
      }
    }
    if (message.mentions.members && message.mentions.members.size > 0) {
      await Promise.all(
        message.mentions.members.map(async (m) => {
          const data = await afkSchema.findOne({ UserId: m.id, GuildId: message.guild.id });

          if (data) {
            const time = Math.round(data.time / 1000);
            await message.reply(`**${m.user.tag}** đã AFK cách đây <t:${time}:R> với lí do: ${data.reason || 'Thích thì afk không lí do'}.`)
          }
        })
      );
    }
    
    let dataPrefix = await prefixSchema.findOne({
      guildId: message.guild.id
    })
    
    const content = message.content
    const dataAr = await autoresponderSchema.findOne({ guildId: message.guild.id, trigger: content.toLowerCase() });
    if (dataAr) return message.channel.send(dataAr.reply);

    const mentionPrefix = `<@${client.user.id}>`;
    const defaultPrefix = client.cf.prefix;
    const customPrefix = dataPrefix?.prefix || null;
    const prefixes = [mentionPrefix, customPrefix, defaultPrefix]
    const prefix = customPrefix || defaultPrefix;
    const prefixUsed = prefixes.find(prefix => content.toLowerCase().startsWith(prefix));
    if (!prefixUsed) return;
    const args = content.slice(prefixUsed.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    client.cmd = cmd;

    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (command) {
      if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 1) * 1000;
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = Math.floor(expirationTime / 1000);
          return client.deleteMsg(message, `${client.e.error} Vui lòng chờ <t:${timeLeft}:R> để sử dụng lại lệnh này!`, 5000, "reply");
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      if (command.group === "dev" && !client.cf.dev.includes(message.author.id)) return;

      const sendMessagesPerm = message.guild.members.me.permissionsIn(message.channel).has(["SendMessages"]);
      if (!sendMessagesPerm) {
        return message.author.send(`${client.e.error} | Tớ không thể gửi tin nhắn trong kênh này được. Vui lòng liên hệ admin hoặc owner để tớ có thể dụng lệnh nhé!`).catch({})
      }

      // bot permissions
      if (command.bperms && command.bperms.length > 0) {
        const missingChannelBotPerms = command.bperms.filter(perm => !message.guild.members.me.permissions.has(perm))

        const missingPermsFormatted = client.parsePerm(missingChannelBotPerms);
        if (missingChannelBotPerms > 0) {
          return client.deleteMsg(message, `${client.e.error} Vui lòng thêm quyền \`${missingPermsFormatted}\` cho tôi để tôi có thể sử dụng lệnh này!`, 8000, "reply");
        }
      }

      // user permissions
      if (command.uperms && command.uperms.length > 0) {        
        const missingUserChannelPerms = command.uperms.filter(perm => !message.member.permissions.has(perm));      
        const missingPermsFormatted = client.parsePerm(missingUserChannelPerms)

        if (missingUserChannelPerms > 0 && !client.cf.dev.includes(message.author.id)) {
          return client.deleteMsg(message, `${client.e.error} Bạn cần có quyền \`${missingPermsFormatted}\` để có thể sử dụng lệnh này!`, 5000, "reply");
        }
      }

      try {
        await command.execute(client, message, args, prefix);
        console.log(`[${(message.author.tag).toUpperCase()} ĐÃ DÙNG LỆNH ${(command.name).toUpperCase()} TẠI ${(message.guild.name).toUpperCase()}]`.bold.brightBlue);
      } catch(err) {
        console.log(err)
        await client.deleteMsg(message, `${client.e.error} Đã xảy ra lỗi khi sử dụng lệnh!`, 8000, "reply")
      }
    }
  }
}