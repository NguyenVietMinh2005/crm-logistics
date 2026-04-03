const { google } = require('googleapis');

let googleCredentials;

// Kiểm tra xem đang chạy trên Render hay ở máy
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    googleCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log("✅ Đã kết nối Google Sheets qua biến môi trường (Render)");
  } catch (err) {
    console.error("❌ Lỗi định dạng JSON trong biến môi trường:", err.message);
  }
} else {
  try {
    googleCredentials = require('../credentials.json'); 
    console.log("✅ Đã kết nối Google Sheets qua file local");
  } catch (err) {
    console.error("⚠️ Không tìm thấy file credentials.json ở máy local. Hãy kiểm tra lại đường dẫn!");
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// --- ĐÂY LÀ HÀM BẠN BỊ THIẾU NÃY GIỜ ---
const appendDataToSheet = async (customerData) => {
    try {
        const sheetId = process.env.GOOGLE_SHEET_ID; // Đảm bảo bạn đã điền biến này trên Render
        
        // Gắn dữ liệu vào các cột (Từ A đến G)
        const values = [
            [
                customerData.companyName,
                customerData.taxCode,
                customerData.contactPerson,
                customerData.phone,
                customerData.email,
                customerData.serviceType,
                customerData.notes || ''
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:G', // CHÚ Ý: Đổi chữ 'Sheet1' thành đúng tên trang tính (tab) của bạn ở dưới đáy file Google Sheet
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });
        console.log("✅ Đã bắn dữ liệu thành công lên Google Sheets!");
    } catch (error) {
        console.error("❌ Lỗi khi ghi lên Google Sheets:", error);
        throw error;
    }
};

// Xuất khẩu chung cả 2 món ra ngoài cho controller xài
module.exports = { sheets, appendDataToSheet };