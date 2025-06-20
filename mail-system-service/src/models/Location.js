const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationId:  {type: String, default: () => new mongoose.Types.ObjectId().toString(),},
  userId:      {type: String,  required: true,},
  coordinates: {latitude: Number,longitude: Number,},
  lastUpdated: {type: Date,default: Date.now,},
  city: String,
  country: String,
});

module.exports = mongoose.model('Location', locationSchema);