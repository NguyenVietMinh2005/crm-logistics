const mongoose = require('mongoose');

const riskLogSchema = new mongoose.Schema({
    hsCode: { type: String, required: true, unique: true }, // Mã HS rủi ro (Ví dụ: 853690)
    itemName: { type: String, required: true }, // Tên mặt hàng
    riskDescription: { type: String, required: true }, // Mô tả rủi ro (Ví dụ: Hay bị tham vấn giá)
    requiredDocuments: { type: String, required: true } // Giấy tờ bắt buộc đòi khách (Ví dụ: Yêu cầu nộp Catalogue)
}, { timestamps: true });

module.exports = mongoose.model('RiskLog', riskLogSchema);