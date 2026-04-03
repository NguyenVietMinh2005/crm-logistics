const Customer = require('../models/Customer');
const { appendDataToSheet } = require('../services/googleSheets');

// 1. [POST] api/customers/submit-form (Gửi form CÓ KÈM FILE)
const submitCustomerForm = async (req, res) => {
    try {
        // Lấy danh sách tên file đã được Multer lưu vào thư mục 'uploads'
        const filePaths = req.files ? req.files.map(file => file.path) : [];

        // Gom dữ liệu chữ (text) lại
        const customerData = {
            companyName: req.body.companyName,
            taxCode: req.body.taxCode,
            contactPerson: req.body.contactPerson,
            email: req.body.email,
            phone: req.body.phone,
            serviceType: req.body.serviceType,
            notes: req.body.notes,
            // Chuyển chuỗi JSON trở lại thành Object
            hsCodeDetails: req.body.hsCodeDetails ? JSON.parse(req.body.hsCodeDetails) : {},
            attachedFiles: filePaths // Lưu danh sách file vào DB
        };

        const newCustomer = new Customer(customerData);
        await newCustomer.save();

        await appendDataToSheet(customerData); 

        res.status(201).json({
            success: true,
            message: 'Đã gửi hồ sơ và chứng từ thành công!',
            data: newCustomer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi lưu dữ liệu',
            error: error.message
        });
    }
};

// 2. [GET] api/customers/ (Lấy danh sách khách hàng)
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 }); 
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy dữ liệu'
        });
    }
};

// 3. [PUT] api/customers/:id/status (Cập nhật trạng thái)
const updateCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id, 
            { status: status }, 
            { returnDocument: 'after' } // ĐÃ SỬA: Thay new: true thành chuẩn mới
        );

        res.status(200).json({ success: true, data: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái' });
    }
};

// 4. [POST] api/customers/:id/interaction (Thêm nhật ký chăm sóc)
const addInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, note } = req.body;
        
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id, 
            { $push: { interactionHistory: { type, note } } },
            { returnDocument: 'after' } // ĐÃ SỬA: Thay new: true thành chuẩn mới
        );

        res.status(200).json({ success: true, data: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi thêm nhật ký tương tác' });
    }
};
// XUẤT ĐẦY ĐỦ CẢ 3 HÀM RA NGOÀI (Lỗi của bạn nằm ở đây)
module.exports = {
    submitCustomerForm,
    getAllCustomers,
    updateCustomerStatus,
    addInteraction
};