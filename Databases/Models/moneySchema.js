const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  id: String,
  moneys: Number,
})

module.exports = mongoose.model('moneySchema', moneySchema)