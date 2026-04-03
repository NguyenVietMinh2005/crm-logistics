import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

function KnowledgeBase() {
  const [risks, setRisks] = useState([]);
  const [formData, setFormData] = useState({ hsCode: '', itemName: '', riskDescription: '', requiredDocuments: '' });

  // 1. Tải dữ liệu lần đầu khi mới mở trang (Viết trực tiếp vào useEffect để Linter không bắt lỗi)
  useEffect(() => { 
    const loadInitialData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/risks`);
        setRisks(res.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    loadInitialData();
  }, []);

  // 2. Hàm gọi API dùng riêng cho các nút bấm (Thêm/Xóa) để làm mới bảng
  const fetchRisks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/risks`);
      setRisks(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/risks`, formData);
      alert('Đã cập nhật Thư viện kiến thức thành công!');
      setFormData({ hsCode: '', itemName: '', riskDescription: '', requiredDocuments: '' });
      fetchRisks(); // Gọi lại để làm mới bảng
    } catch (error) {
      alert('Lỗi! Mã HS này có thể đã tồn tại trong thư viện.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cảnh báo này?")) {
      try {
        await axios.delete(`${API_URL}/api/risks/${id}`);
        fetchRisks(); // Gọi lại để làm mới bảng
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa!');
        console.error(error);
      }
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ margin: 0, color: '#333' }}>📚 Thư Viện Kiến Thức & Nhật Ký Rủi Ro (Risk Log)</h2>

      {/* Form thêm mới */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0 }}>➕ Đóng góp bài học kinh nghiệm</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><label><b>Mã HS Code (*)</b></label><input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} required placeholder="VD: 853690" style={inputStyle} /></div>
          <div style={{ flex: 2 }}><label><b>Tên nhóm hàng (*)</b></label><input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required placeholder="VD: Thiết bị điện đóng ngắt" style={inputStyle} /></div>
          <div style={{ flex: 3 }}><label><b>Mô tả rủi ro (*)</b></label><input type="text" name="riskDescription" value={formData.riskDescription} onChange={handleChange} required placeholder="VD: Thường xuyên bị đưa vào luồng Vàng..." style={inputStyle} /></div>
          <div style={{ flex: 3 }}><label><b>Yêu cầu chứng từ (*)</b></label><input type="text" name="requiredDocuments" value={formData.requiredDocuments} onChange={handleChange} required placeholder="VD: Bắt buộc đính kèm Catalogue..." style={inputStyle} /></div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>Lưu vào Thư Viện</button>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0 }}>📋 Danh sách Cảnh báo sớm Hệ thống</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Mã HS</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Tên mặt hàng</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px', color: '#dc3545' }}>Rủi ro cảnh báo</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px', color: '#28a745' }}>Chứng từ bắt buộc</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu rủi ro.</td></tr> : risks.map((r) => (
              <tr key={r._id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px', fontWeight: 'bold' }}>{r.hsCode}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{r.itemName}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px', color: '#dc3545' }}>{r.riskDescription}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px', color: '#28a745', fontWeight: 'bold' }}>{r.requiredDocuments}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                  <button onClick={() => handleDelete(r._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KnowledgeBase;