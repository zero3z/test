module.exports = {
  name: "messageUpdate",
  once: false,
  async execute(client, oldMessage, newMessage) {
    //if (newMessage.author.bot) return
    if (oldMessage.content === newMessage.content) return;
    if (!oldMessage.content || !newMessage.content) return;

    let esnipes = client.esnipes.get(oldMessage.channel.id) || [];
    esnipes.unshift({
      channel: newMessage.channel.name,
      oldMsg: oldMessage.content,
      newMsg: newMessage.content,
      author: newMessage.author,
      date: newMessage.createdAt,
    })
    esnipes.splice(15);
    client.esnipes.set(oldMessage.channel.id, esnipes);
  },
};