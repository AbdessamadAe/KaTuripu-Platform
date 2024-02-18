const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (!uri) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
