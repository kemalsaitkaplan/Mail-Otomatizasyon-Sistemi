const mongoose = require('mongoose');

const emailScheduleSchema = new mongoose.Schema({
  scheduleId:    {type: String, default: () => new mongoose.Types.ObjectId().toString(),},
  userId:        {type: String, required: true,},
  templateId:    {type: String, required: true,},
  scheduledTime: {type: Date,   required: true, },
  variables:     {type: Object, default: {},},
  status:        {type: String, enum: ['pending', 'sent', 'failed'], default: 'pending',},
});

module.exports = mongoose.model('EmailSchedule', emailScheduleSchema);