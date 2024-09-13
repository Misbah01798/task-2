// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  totalSpent: Number,
});
module.exports = mongoose.model('User', UserSchema);




