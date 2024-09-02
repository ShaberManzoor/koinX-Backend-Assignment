const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  price: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Price', priceSchema);