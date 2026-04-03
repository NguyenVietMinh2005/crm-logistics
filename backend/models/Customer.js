const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    companyName: { type: String, required: [true, 'Vui lòng nhập tên công ty'] },
    taxCode: { type: String, required: [true, 'Vui lòng nhập mã số thuế'] },
    contactPerson: { type: String, required: [true, 'Vui lòng nhập người liên hệ'] },
    email: { type: String, required: [true, 'Vui lòng nhập email'] },
    phone: { type: String, required: [true, 'Vui lòng nhập số điện thoại'] },
    serviceType: { type: String, required: [true, 'Vui lòng chọn dịch vụ đang làm'] },
    notes: { type: String },
    status: { type: String, default: 'Kho dữ liệu' },
    
    // ĐÃ FIX: Thêm dấu phẩy ở cuối dòng này
    hsCodeDetails: { type: Object }, 
    
    interactionHistory: [{
        type: { type: String, enum: ['Cuộc gọi', 'Cuộc gặp', 'Email'] }, // Phân loại tương tác
        note: String, // Nội dung trao đổi
        date: { type: Date, default: Date.now } // Thời gian
    }]

}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);