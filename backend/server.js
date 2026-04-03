// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173', 'https://crm-logistics-zxee.vercel.app'], // Dán link Vercel của bạn vào đây
    credentials: true
}));
const connectDB = require('./config/db'); // <-- Import file cấu hình db

const app = express();
const PORT = process.env.PORT || 5000;

// Thực thi hàm kết nối Database
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());

// Thêm 2 dòng này vào dưới chỗ khai báo customerRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const riskRoutes = require('./routes/riskRoutes');
app.use('/api/risks', riskRoutes);

// Import Routes
const customerRoutes = require('./routes/customerRoutes'); 
app.use('/api/customers', customerRoutes); 

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hệ thống CRM Backend đã hoạt động!' });
});

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});