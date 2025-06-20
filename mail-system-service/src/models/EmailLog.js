const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId: String,
  templateId: String,
  sentAt: Date,
  openedAt: Date,
  status: String,
});

module.exports = mongoose.model('EmailLog', emailLogSchema);