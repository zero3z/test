const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
  GuildId: String,
  UserId: String,
  reason: String,
  time: String
})

module.exports = mongoose.model('afkSchema', afkSchema)