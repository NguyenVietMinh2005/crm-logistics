const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // Thêm thư viện quản lý file
const path = require('path'); // Thêm thư viện xử lý đường dẫn
const { submitCustomerForm, getAllCustomers, updateCustomerStatus, addInteraction } = require('../controllers/customerController');

// --- ĐOẠN CODE MỚI: TỰ ĐỘNG TẠO THƯ MỤC UPLOADS NẾU CHƯA CÓ ---
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Đã tạo thư mục uploads thành công!");
}
// ---------------------------------------------------------------

// 1. Cấu hình "người vận chuyển" Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Nơi lưu file
    },
    filename: function (req, file, cb) {
        // Đổi tên file để không bị trùng (thêm thời gian vào trước tên gốc)
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 2. Gắn Multer vào đường dẫn (Cho phép upload tối đa 5 file cùng lúc)
router.post('/submit-form', upload.array('files', 5), submitCustomerForm);

router.get('/', getAllCustomers);
router.put('/:id/status', updateCustomerStatus);
router.post('/:id/interaction', addInteraction);

module.exports = router;