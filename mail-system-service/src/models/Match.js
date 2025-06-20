const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchId:   {type: String, default: () => new mongoose.Types.ObjectId().toString(),},
  user1Id:   {type: String, required: true,},
  user2Id:   {type: String, required: true,},
  matchDate: {type: Date, default: Date.now,},
  status:    {type: String,enum: ['active', 'blocked', 'expired'], default: 'active',},
  lastInteraction: Date,
});

module.exports = mongoose.model('Match', matchSchema);
