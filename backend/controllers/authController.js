const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TỰ ĐỘNG TẠO TÀI KHOẢN MẶC ĐỊNH KHI CHẠY SERVER
const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            await User.create({ username: 'admin', password: hashedPassword });
            console.log('✅ Đã tự động tạo tài khoản: admin / Mật khẩu: 123456');
        }
    } catch (error) {
        console.log('Lỗi tạo tài khoản mặc định', error);
    }
};
createDefaultAdmin(); // Gọi hàm chạy luôn

// API ĐĂNG NHẬP
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Kiểm tra tài khoản có tồn tại không
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });

        // 2. Kiểm tra mật khẩu (so sánh mật khẩu gõ vào với mật khẩu đã mã hóa trong DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });

        // 3. Tạo Token (thẻ ra vào) có hạn 1 ngày
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token: token,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { login };