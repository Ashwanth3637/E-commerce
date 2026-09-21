require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/e_commerce';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Atlas Connected successfully to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
  }
}

connectDB();

module.exports = mongoose;
