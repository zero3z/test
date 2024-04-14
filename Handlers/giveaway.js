const { GiveawaysManager } = require('discord-giveaways');
const giveawayModel = require("../Databases/Models/giveawaySchema");

module.exports = (client) => {
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
      return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
      await giveawayModel.create(giveawayData);
      return true;
    }

    async editGiveaway(messageId, giveawayData) {
      await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
      return true;
    }

    async deleteGiveaway(messageId) {
      await giveawayModel.deleteOne({ messageId }).exec();
      return true;
    }
  };

  const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
      botsCanWin: false,
      embedColor: '#FFD5D1',
      embedColorEnd: '#FFD5D1',
      reaction: client.gacf.giveawayManager.reaction
    },
  });
  client.giveawaysManager = manager;
}