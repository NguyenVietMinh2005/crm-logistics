const RiskLog = require('../models/RiskLog');

// 1. Lấy toàn bộ danh sách rủi ro
const getRiskLogs = async (req, res) => {
    try {
        const logs = await RiskLog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu' });
    }
};

// 2. Thêm một rủi ro mới vào thư viện
const addRiskLog = async (req, res) => {
    try {
        const newLog = new RiskLog(req.body);
        await newLog.save();
        res.status(201).json({ success: true, message: 'Đã thêm rủi ro vào thư viện!', data: newLog });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Mã HS này có thể đã tồn tại hoặc lỗi dữ liệu!' });
    }
};

// 3. Xóa một rủi ro
const deleteRiskLog = async (req, res) => {
    try {
        await RiskLog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Đã xóa thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xóa' });
    }
};

module.exports = { getRiskLogs, addRiskLog, deleteRiskLog };