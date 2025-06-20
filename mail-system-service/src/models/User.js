const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  appId: String,
  lastLogin: Date,
  createdAt: Date,
  status: String,
});

module.exports = mongoose.model('User', userSchema);