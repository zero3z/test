module.exports = {
  name: "messageDelete",
  once: false,
  async execute(client, message) {
    if (!message) return;
    let snipes = client.snipes.get(message.channel.id) || [];
    snipes.unshift({
      channel: message.channel.name,
      content: message.content,
      author: message.author,
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null,
      date: new Date()
    });
    snipes.splice(15);
    client.snipes.set(message.channel.id, snipes);
  },
};