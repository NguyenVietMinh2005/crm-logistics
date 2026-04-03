const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Kết nối với MongoDB bằng chuỗi URI trong file .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`✅ Đã kết nối MongoDB thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        // Dừng server nếu không kết nối được database
        process.exit(1); 
    }
};

module.exports = connectDB;