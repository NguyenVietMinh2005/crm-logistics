const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

let googleCredentials;

// Kiểm tra môi trường (Render hoặc Local)
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    googleCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error("❌ Lỗi JSON credentials:", err.message);
  }
} else {
  try {
    googleCredentials = require('../credentials.json');
  } catch (err) {
    console.error("⚠️ Thiếu file credentials.json!");
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const appendDataToSheet = async (customerData) => {
    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const hs = customerData.hsCodeDetails || {}; // Lấy mớ câu hỏi nghiệp vụ

        // 1. Biến đổi đường dẫn file (VD: 'uploads/1775...-3.docx' thành '3.docx')
        const fileLinks = customerData.attachedFiles && customerData.attachedFiles.length > 0 
            ? customerData.attachedFiles.map(filePath => {
                // Tách bỏ phần 'uploads/' và chuỗi thời gian, chỉ lấy tên gốc đằng sau dấu '-' đầu tiên
                return filePath.split('-').slice(1).join('-');
            }).join('\n') 
            : 'Không có file đính kèm';

        // 2. Tạo mảng dữ liệu khớp với các cột (Thứ tự từ A đến AL)
        const values = [
            [
                customerData.companyName,         // Cột A: Tên công ty
                customerData.taxCode,             // Cột B: MST
                customerData.contactPerson,       // Cột C: PIC
                customerData.phone,               // Cột D: SĐT
                customerData.email,               // Cột E: Email
                customerData.serviceType,         // Cột F: Dịch vụ
                customerData.notes || '',         // Cột G: Ghi chú chung
                hs.hsCode || '',                  // Cột H: Mã HS dự kiến
                hs.q1_loaiHinhDN || '',           // Cột I: Loại hình DN
                hs.q2_nhapXuat || '',             // Cột J: Nhập/Xuất
                hs.q2_maLoaiHinh || '',           // Cột K: Mã loại hình khai báo
                hs.q2_mucDich || '',              // Cột L: Mục đích XNK
                hs.q2_ghiChu || '',               // Cột M: Ghi chú loại hình
                hs.q3_nhomChuyenNganh || '',      // Cột N: Nhóm chuyên ngành
                hs.q4_phanLoaiQuanLy || '',       // Cột O: Phân loại quản lý
                hs.q6_tenThuongMai || '',         // Cột P: Tên thương mại
                hs.q7_tenBanChat || '',           // Cột Q: Tên bản chất kỹ thuật
                hs.q8_model || '',                // Cột R: Model
                hs.q9_nhaSanXuat || '',           // Cột S: Nhà sản xuất
                hs.q10_xuatXu || '',              // Cột T: Xuất xứ
                hs.q11_vatLieu || '',             // Cột U: Vật liệu
                hs.q12_thanhPhan || '',           // Cột V: Thành phần
                hs.q13_honHop || '',              // Cột W: Hỗn hợp/Hóa chất
                hs.q14_congDung || '',            // Cột X: Công dụng
                hs.q15_linhVuc || '',             // Cột Y: Lĩnh vực sử dụng
                hs.q16_chucNang || '',            // Cột Z: Chức năng đặc biệt
                hs.q17_thongSo || '',             // Cột AA: Thông số (có cân nặng)
                hs.q18_dien || '',                // Cột AB: Dùng điện?
                hs.q19_dongGoi || '',             // Cột AC: Hình thức đóng gói
                hs.q20_donViTinh || '',           // Cột AD: Đơn vị tính
                hs.q21_kichThuoc || '',           // Cột AE: Kích thước
                hs.q22_trangThai || '',           // Cột AF: Trạng thái hàng
                hs.q23_boPhanMay || '',           // Cột AG: Là bộ phận máy?
                hs.q24_taiLieu || '',             // Cột AH: Ghi chú tài liệu đính kèm
                hs.q25_luuY || '',                // Cột AI: Lưu ý đặc biệt
                hs.q26_boSung || '',              // Cột AJ: Thông tin bổ sung
                fileLinks,                        // Cột AK: DANH SÁCH FILE ĐÍNH KÈM
                new Date().toLocaleString('vi-VN') // Cột AL: Thời gian gửi
            ]
        ];

        // 3. Gửi lên Google Sheet (Mở rộng vùng range đến cột AL)
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Data!A:AL', // Đảm bảo tab tên là 'Data'
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });
        console.log("✅ Toàn bộ hồ sơ và file đã lên Google Sheets!");
    } catch (error) {
        console.error("❌ Lỗi Google Sheets:", error);
        throw error;
    }
};

module.exports = { sheets, appendDataToSheet };