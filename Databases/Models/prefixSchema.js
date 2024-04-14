const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
  guildId: String,
  prefix: String
})

module.exports = mongoose.model('prefixSchema', prefixSchema)