module.exports = {
  name: "addmoney",
  group: "dev",
  aliases: ["am"],
  async execute(client, message, args) {
    const member = await client.getUser(message, args[0], false)
    const amount = args[1];
    if (!amount || isNaN(amount)) return;
    await client.addcash(member.id, parseInt(amount));
    await message.react(client.e.success)
  }
}