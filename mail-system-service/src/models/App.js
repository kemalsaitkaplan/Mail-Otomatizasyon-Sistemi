const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  appId: String,
  name: String,
  category: String,
  description: String,
});

module.exports = mongoose.model('App', appSchema);