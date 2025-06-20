const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId:  {type: String,default: () => new mongoose.Types.ObjectId().toString(),},
  senderId:   {type: String, required: true,},
  receiverId: {type: String, required: true,},
  content:    {type: String, required: true,},
  sentAt:     {type: Date,default: Date.now,},
  readAt: Date,
  status:     {type: String, enum: ['sent', 'delivered', 'read'], default: 'sent',},
});

module.exports = mongoose.model('Message', messageSchema);
