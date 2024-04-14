const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
  id: String,
  streaks: Number,
})

module.exports = mongoose.model('dailySchema', dailySchema)