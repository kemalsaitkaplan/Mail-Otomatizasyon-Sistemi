const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  templateId: String,
  appId: String,
  category: String,
  type: String,
  subject: String,
  content: String,
  variables: [String],
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);