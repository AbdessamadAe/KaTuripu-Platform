const mongoose = require('mongoose');
const uri = "mongodb+srv://katuripu:kat@cluster0.m9d6zyv.mongodb.net/Platform";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
