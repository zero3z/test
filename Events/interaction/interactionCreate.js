const { Collection } = require('discord.js');

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(client, interaction) {
    if (interaction.isCommand()) {
      const command = client.interactions.get(interaction.commandName);
      
      if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown) * 1000;
      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({ content: `Vui lòng chờ ${timeLeft.toFixed(1)} giây để sử dụng lệnh này!`, ephemeral: true });
        }
      }
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      // bot permissions
      if (command.bperms && command.bperms.length > 0) {
        if (!interaction.guild.members.me.permissions.has(command.bperms)) return interaction.reply({
          content: `${client.e.error} Tôi phải được bật quyền \`${command.bperms}\` để có thể dùng lệnh này!`, ephemeral: true
        })
      }

      // user permissions
      if (command.uperms && command.uperms.length > 0) {
        if (!interaction.member.permissions.has(command.uperms)) return interaction.reply({
          content: `${client.e.error} Bạn cần có quyền \`${client.parsePerm(command.uperms)}\` để có thể dùng lệnh này!`, ephemeral: true
        });
      }
      
      try {
        await command.execute(client, interaction);
        console.log(`[${(interaction.user.tag).toUpperCase()} ĐÃ DÙNG LỆNH ${(command.name).toUpperCase()} TẠI ${(interaction.guild.name).toUpperCase()}]`.bold.brightBlue);
      } catch (err) {
        console.error(err)
        interaction.reply({ content: `Đã xảy ra lỗi khi thực hiện lệnh này.`, ephemeral: true })
      }
    }
  }
}