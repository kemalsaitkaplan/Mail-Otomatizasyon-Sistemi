const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("Mongo URI not provided in environment variables.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');
  } catch (err) {
    console.error('MongoDB connect error', err);
    process.exit(1);
  }
};

module.exports = connectDB;

