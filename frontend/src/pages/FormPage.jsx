import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

function FormPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [weights, setWeights] = useState({ netWeight: '', grossWeight: '' });
  const [weightError, setWeightError] = useState(false); 

  // --- LOGIC RISK LOG (THƯ VIỆN RỦI RO) ---
  const [riskLogs, setRiskLogs] = useState([]); // Chứa danh sách rủi ro lấy từ API
  const [matchedRisk, setMatchedRisk] = useState(null); // Rủi ro bị khớp khi khách nhập mã HS

  const [formData, setFormData] = useState({
    companyName: '', taxCode: '', contactPerson: '', email: '', phone: '', serviceType: '', notes: '',
    hsCode: '', // MỚI THÊM: Cột Mã HS dự kiến để kích hoạt cảnh báo
    q1_loaiHinhDN: '', q2_nhapXuat: '', q2_maLoaiHinh: '', q2_mucDich: '', q2_ghiChu: '',
    q3_nhomChuyenNganh: '', q4_phanLoaiQuanLy: '', q6_tenThuongMai: '', q7_tenBanChat: '', q8_model: '',
    q9_nhaSanXuat: '', q10_xuatXu: '', q11_vatLieu: '', q12_thanhPhan: '', q13_honHop: '',
    q14_congDung: '', q15_linhVuc: '', q16_chucNang: '', q17_thongSo: '', q18_dien: '',
    q19_dongGoi: '', q20_donViTinh: '', q21_kichThuoc: '', q22_trangThai: '', q23_boPhanMay: '',
    q24_taiLieu: '', q25_luuY: '', q26_boSung: ''
  });

  // Tải ngầm Thư viện kiến thức về ngay khi mở Form
  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/risks`);
        setRiskLogs(res.data.data || []);
      } catch (error) {
        console.error("Lỗi tải Thư viện rủi ro", error);
      }
    };
    fetchRisks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Tự động quét Risk Log khi khách gõ Mã HS
    if (name === 'hsCode') {
      const foundRisk = riskLogs.find(r => r.hsCode === value.trim());
      setMatchedRisk(foundRisk || null);
    }
  };

  const handleWeightChange = (e) => {
    const newWeights = { ...weights, [e.target.name]: e.target.value };
    setWeights(newWeights);
    if (newWeights.netWeight && newWeights.grossWeight && Number(newWeights.netWeight) > Number(newWeights.grossWeight)) {
      setWeightError(true);
    } else {
      setWeightError(false);
    }
  };

  const handleFileChange = (e) => setSelectedFiles(e.target.files);

  const handleNextStep = (e) => { e.preventDefault(); setStep(2); window.scrollTo(0, 0); };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    
    // 1. Chặn lỗi Toán học
    if (weightError) {
      alert("Lỗi Logic: Trọng lượng tịnh (Net) không thể lớn hơn Tổng trọng lượng (Gross)!");
      return; 
    }

    // 2. CHẶN RỦI RO (Bắt buộc phải có file đính kèm nếu dính mã HS rủi ro)
    if (matchedRisk && selectedFiles.length === 0) {
      alert(`Mã HS này có cảnh báo rủi ro! Vui lòng tải lên tài liệu bắt buộc: ${matchedRisk.requiredDocuments}`);
      return;
    }

    setStatus({ type: 'loading', message: 'Đang tải file và gửi thông tin...' });

    const payload = new FormData();
    payload.append('companyName', formData.companyName);
    payload.append('taxCode', formData.taxCode);
    payload.append('contactPerson', formData.contactPerson);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('serviceType', formData.serviceType);
    
    const finalHsDetails = {
       ...formData,
       q17_thongSo: `${formData.q17_thongSo} | Net: ${weights.netWeight}kg, Gross: ${weights.grossWeight}kg`
    };
    payload.append('hsCodeDetails', JSON.stringify(finalHsDetails));

    for (let i = 0; i < selectedFiles.length; i++) {
      payload.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post(`${API_URL}/api/customers/submit-form`, payload,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', message: response.data.message });
      setStep(1); 
    } catch (error) {
      setStatus({ type: 'error', message: 'Lỗi gửi dữ liệu hoặc upload file!' });
      console.error(error);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, border: '2px solid red', backgroundColor: '#fff3f3' };
  const sectionStyle = { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #0d6efd', marginBottom: '20px' };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#0d6efd', marginBottom: '5px' }}>HỒ SƠ KHAI BÁO HẢI QUAN</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', fontWeight: 'bold' }}>
        <span style={{ color: step === 1 ? '#0d6efd' : '#28a745' }}>1. Thông tin liên hệ</span>
        <span>{' > '}</span>
        <span style={{ color: step === 2 ? '#0d6efd' : '#888' }}>2. Khai báo mã HS Code</span>
      </div>
      
      {status.message && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da', color: status.type === 'success' ? '#155724' : '#721c24', borderRadius: '4px', textAlign: 'center' }}>{status.message}</div>
      )}

      {/* ================= BƯỚC 1 ================= */}
      {step === 1 && (
        <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div><label><b>Tên công ty (*)</b></label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={inputStyle} /></div>
          <div><label><b>Mã số thuế (*)</b></label><input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} required style={inputStyle} /></div>
          <div><label><b>Người liên hệ (*)</b></label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required style={inputStyle} /></div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label><b>Email (*)</b></label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label><b>Số điện thoại (*)</b></label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} /></div>
          </div>
          <div>
            <label><b>Dịch vụ đang quan tâm (*)</b></label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} required style={inputStyle}>
              <option value="">-- Chọn dịch vụ --</option>
              <option value="Khai báo hải quan">Khai báo hải quan</option>
              <option value="Vận tải đường biển (FCL/LCL)">Vận tải đường biển (FCL/LCL)</option>
              <option value="Vận tải đường hàng không">Vận tải đường hàng không</option>
              <option value="Dịch vụ kho bãi">Dịch vụ kho bãi</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Tiếp tục (Bước 2) ➔</button>
        </form>
      )}

      {/* ================= BƯỚC 2 ================= */}
      {step === 2 && (
        <form onSubmit={handleSubmitFinal} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* MÃ HS DỰ KIẾN VÀ CẢNH BÁO RỦI RO */}
          <div style={{...sectionStyle, borderLeft: matchedRisk ? '4px solid #dc3545' : '4px solid #28a745', backgroundColor: matchedRisk ? '#fff5f5' : '#f8f9fa'}}>
            <label><b>Mã HS Code dự kiến (Nếu có)</b></label>
            <input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} placeholder="Nhap ma HS code..." style={matchedRisk ? errorInputStyle : inputStyle} />
            
            {/* Pop-up hiển thị Cảnh báo sớm nếu quét trúng Risk Log */}
            {matchedRisk && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '8px', border: '1px solid #dc3545' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>🚨 CẢNH BÁO RỦI RO HẢI QUAN</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Nhóm hàng:</b> {matchedRisk.itemName}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Rủi ro nhận diện:</b> <span style={{color: '#dc3545'}}>{matchedRisk.riskDescription}</span></p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><b>YÊU CẦU NGHIỆP VỤ BẮT BUỘC:</b> Quý khách vui lòng đính kèm <b style={{color: '#0d6efd'}}>{matchedRisk.requiredDocuments}</b> ở phần Upload bên dưới để U&I chuẩn bị sẵn hồ sơ giải trình.</p>
              </div>
            )}
          </div>

          <div style={{...sectionStyle, borderLeft: '4px solid #dc3545'}}>
            <h4 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>⚠ Kiểm soát Logic & Chứng từ</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Trọng lượng tịnh (Net Weight) - kg</label>
                <input type="number" name="netWeight" value={weights.netWeight} onChange={handleWeightChange} required style={weightError ? errorInputStyle : inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Tổng trọng lượng (Gross Weight) - kg</label>
                <input type="number" name="grossWeight" value={weights.grossWeight} onChange={handleWeightChange} required style={weightError ? errorInputStyle : inputStyle} />
              </div>
            </div>
            {weightError && (
              <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
                ❌ LỖI LOGIC: Trọng lượng tịnh (Net) không thể lớn hơn Tổng trọng lượng (Gross).
              </div>
            )}

            <label style={{marginTop:'15px', display:'block'}}><b>📎 Tải Lên Chứng Từ {matchedRisk ? <span style={{color: 'red'}}>(BẮT BUỘC)</span> : ''}</b></label>
            <input type="file" multiple onChange={handleFileChange} style={{...inputStyle, padding: '10px', backgroundColor: '#fff'}} required={!!matchedRisk} />
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>I. Thông tin Doanh nghiệp & Loại hình</h4>
            <label>1. Loại hình công ty?</label><select name="q1_loaiHinhDN" value={formData.q1_loaiHinhDN} onChange={handleChange} style={inputStyle}><option value="">- Chọn -</option><option value="Sản xuất">Sản xuất</option><option value="Thương mại">Thương mại</option><option value="Gia công/SXXK">Gia công / SXXK</option><option value="Chế xuất (EPE)">Chế xuất (EPE)</option><option value="Logistics/Phân phối">Logistics/Phân phối</option><option value="Khác">Khác</option></select>
            <label style={{marginTop:'10px', display:'block'}}>2. Hàng hóa thuộc loại hình nào?</label><select name="q2_nhapXuat" value={formData.q2_nhapXuat} onChange={handleChange} style={inputStyle}><option value="">- Chọn -</option><option value="Nhập khẩu">Nhập khẩu</option><option value="Xuất khẩu">Xuất khẩu</option></select>
            <label style={{marginTop:'10px', display:'block'}}>Mã loại hình khai báo (A11, A12, E31...)</label><input type="text" name="q2_maLoaiHinh" value={formData.q2_maLoaiHinh} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>Mục đích XNK (Bán thương mại...)</label><input type="text" name="q2_mucDich" value={formData.q2_mucDich} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>Ghi chú loại hình (nếu có)</label><input type="text" name="q2_ghiChu" value={formData.q2_ghiChu} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>3. Hàng có thuộc nhóm chuyên ngành/đặc biệt?</label><input type="text" name="q3_nhomChuyenNganh" value={formData.q3_nhomChuyenNganh} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>4. Phân loại quản lý?</label><select name="q4_phanLoaiQuanLy" value={formData.q4_phanLoaiQuanLy} onChange={handleChange} style={inputStyle}><option value="">- Chọn -</option><option value="Thông thường">Thông thường</option><option value="Phải KT chuyên ngành">Phải KT chuyên ngành</option><option value="Hàng nguy hiểm">Hàng nguy hiểm</option><option value="Có điều kiện nhập/xuất">Có điều kiện</option></select>
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>II. Thông tin nhận diện hàng hóa</h4>
            <label>6. Tên thương mại (Trade name)</label><input type="text" name="q6_tenThuongMai" value={formData.q6_tenThuongMai} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>7. Tên hàng hóa theo bản chất kỹ thuật</label><input type="text" name="q7_tenBanChat" value={formData.q7_tenBanChat} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>8. Model / mã sản phẩm</label><input type="text" name="q8_model" value={formData.q8_model} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>9. Nhà sản xuất</label><input type="text" name="q9_nhaSanXuat" value={formData.q9_nhaSanXuat} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>10. Xuất xứ hàng hóa</label><input type="text" name="q10_xuatXu" value={formData.q10_xuatXu} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>III. Đặc điểm cấu tạo & Thành phần</h4>
            <label>11. Cấu tạo từ vật liệu nào?</label><input type="text" name="q11_vatLieu" value={formData.q11_vatLieu} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>12. Thành phần cấu tạo (tỷ lệ %)</label><input type="text" name="q12_thanhPhan" value={formData.q12_thanhPhan} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>13. Có phải hỗn hợp/hợp chất hóa học?</label><input type="text" name="q13_honHop" value={formData.q13_honHop} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>IV. Công dụng & Thông số</h4>
            <label>14. Công dụng chính</label><input type="text" name="q14_congDung" value={formData.q14_congDung} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>15. Sử dụng trong lĩnh vực nào?</label><input type="text" name="q15_linhVuc" value={formData.q15_linhVuc} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>16. Chức năng đặc biệt (Lọc, bơm...)</label><input type="text" name="q16_chucNang" value={formData.q16_chucNang} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>17. Thông số KT khác</label><input type="text" name="q17_thongSo" value={formData.q17_thongSo} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>18. Có dùng điện không?</label><input type="text" name="q18_dien" value={formData.q18_dien} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>V. Đóng gói & Trạng thái</h4>
            <label>19. Hình thức đóng gói</label><input type="text" name="q19_dongGoi" value={formData.q19_dongGoi} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>20. Đơn vị tính</label><input type="text" name="q20_donViTinh" value={formData.q20_donViTinh} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>21. Kích thước (Dài x Rộng x Cao)</label><input type="text" name="q21_kichThuoc" value={formData.q21_kichThuoc} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>22. Trạng thái (Hoàn chỉnh, Bán thành phẩm...)</label><input type="text" name="q22_trangThai" value={formData.q22_trangThai} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>23. Là bộ phận của máy móc khác?</label><input type="text" name="q23_boPhanMay" value={formData.q23_boPhanMay} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <h4 style={{ margin: '0 0 15px 0' }}>VI. Thông tin khác</h4>
            <label>24. Ghi chú về các tài liệu đính kèm</label><input type="text" name="q24_taiLieu" value={formData.q24_taiLieu} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>25. Lưu ý đặc biệt</label><input type="text" name="q25_luuY" value={formData.q25_luuY} onChange={handleChange} style={inputStyle} />
            <label style={{marginTop:'10px', display:'block'}}>26. Thông tin bổ sung khác</label><textarea name="q26_boSung" value={formData.q26_boSung} onChange={handleChange} rows="3" style={inputStyle}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => { setStep(1); window.scrollTo(0, 0); }} style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>🡠 Quay lại</button>
            <button type="submit" disabled={status.type === 'loading' || weightError} style={{ flex: 2, padding: '12px', backgroundColor: weightError ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: weightError ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
              {status.type === 'loading' ? 'Đang gửi...' : 'Hoàn Tất & Gửi Hồ Sơ ✔'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormPage;