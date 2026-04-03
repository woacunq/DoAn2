const mongoose = require('mongoose');

/**
 * @description Thiết lập kết nối tới MongoDB Local
 * @process Sử dụng biến MONGO_URI từ file .env
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
};

module.exports = connectDB;