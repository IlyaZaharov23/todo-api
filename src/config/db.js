const mongoose = require("mongoose");

const MONGO_URL = `${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}`;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL)        
    } catch (error) {
        return error
    }
}

module.exports = connectDB