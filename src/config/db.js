const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_DB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
  } catch (error) {
    return error;
  }
}

module.exports = connectDB;
