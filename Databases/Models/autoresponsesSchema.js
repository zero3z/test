const mongoose = require('mongoose');

const autoresponsesSchema = new mongoose.Schema({
  guildId: String,
  matchmode: String,
  trigger: String,
  reply: String
})

module.exports = mongoose.model('autoresponsesSchema', autoresponsesSchema)