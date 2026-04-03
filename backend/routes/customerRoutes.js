const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitCustomerForm, getAllCustomers, updateCustomerStatus, addInteraction } = require('../controllers/customerController');


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