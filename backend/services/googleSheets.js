const { google } = require('googleapis');

let googleCredentials;

// Kiểm tra xem đang chạy trên Render (có biến môi trường) hay ở máy (có file)
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    googleCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log("✅ Đã kết nối Google Sheets qua biến môi trường (Render)");
  } catch (err) {
    console.error("❌ Lỗi định dạng JSON trong biến môi trường:", err.message);
  }
} else {
  try {
    // Chú ý: Kiểm tra lại đường dẫn file credentials.json trên máy bạn
    // Nếu file nằm cùng thư mục services thì để './credentials.json'
    // Nếu file nằm ở thư mục backend (ngoài services) thì để '../credentials.json'
    googleCredentials = require('../credentials.json'); 
    console.log("✅ Đã kết nối Google Sheets qua file local");
  } catch (err) {
    console.error("⚠️ Không tìm thấy file credentials.json ở máy local. Hãy kiểm tra lại đường dẫn!");
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials, // Dùng 'credentials' thay vì 'keyFile'
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = sheets;