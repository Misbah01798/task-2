// models/PurchaseHistory.js
const mongoose = require('mongoose');
const PurchaseHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  total: Number,
});
module.exports = mongoose.model('PurchaseHistory', PurchaseHistorySchema);