const mongoose = require('mongoose');

const marrySchema = new mongoose.Schema({
  authorId: String,
  husbandId: String,
  wifeId: String,
  time: String
})

module.exports = mongoose.model('marrySchema', marrySchema)