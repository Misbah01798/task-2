// models/Product.js
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  productName: String,
  price: Number,
});
module.exports = mongoose.model('Product', ProductSchema);