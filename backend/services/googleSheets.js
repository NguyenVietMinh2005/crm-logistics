const { google } = require('googleapis');
const path = require('path');

// Kiểm tra xem đang chạy ở máy cá nhân hay trên Render
const googleCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON 
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) // Nếu có biến môi trường thì dùng
  : require('./credentials.json'); // Nếu ở máy cá nhân thì vẫn đọc file cũ

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials, // <-- Dùng biến credentials thay vì keyFile
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const appendDataToSheet = async (data) => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        const hs = data.hsCodeDetails || {};
        
        // Nối tên các file đính kèm thành 1 chuỗi cách nhau bởi dấu phẩy
        const danhSachFile = data.attachedFiles && data.attachedFiles.length > 0 
            ? data.attachedFiles.join(', ') 
            : 'Không có file';

        const values = [
            [
                data.companyName, data.taxCode, data.contactPerson, data.email, data.phone, data.serviceType, data.notes,
                new Date().toLocaleString('vi-VN'), // Cột H: Thời gian
                
                // Từ cột I đến AJ
                hs.q1_loaiHinhDN || '', hs.q2_nhapXuat || '', hs.q2_maLoaiHinh || '', hs.q2_mucDich || '', hs.q2_ghiChu || '',
                hs.q3_nhomChuyenNganh || '', hs.q4_phanLoaiQuanLy || '', hs.q6_tenThuongMai || '', hs.q7_tenBanChat || '',
                hs.q8_model || '', hs.q9_nhaSanXuat || '', hs.q10_xuatXu || '', hs.q11_vatLieu || '', hs.q12_thanhPhan || '',
                hs.q13_honHop || '', hs.q14_congDung || '', hs.q15_linhVuc || '', hs.q16_chucNang || '', hs.q17_thongSo || '',
                hs.q18_dien || '', hs.q19_dongGoi || '', hs.q20_donViTinh || '', hs.q21_kichThuoc || '', hs.q22_trangThai || '',
                hs.q23_boPhanMay || '', hs.q24_taiLieu || '', hs.q25_luuY || '', hs.q26_boSung || '',
                
                // Cột AK (MỚI THÊM): Danh sách đường dẫn file đính kèm
                danhSachFile
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:AK', // MỞ RỘNG VÙNG DỮ LIỆU ĐẾN CỘT AK
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log('✅ Đã backup dữ liệu thành công lên Google Sheets');
    } catch (error) {
        console.error('❌ Lỗi khi lưu lên Google Sheets:', error.message);
    }
};

module.exports = { appendDataToSheet };