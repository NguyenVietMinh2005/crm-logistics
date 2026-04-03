import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { API_URL } from '../api';

function Customers({ type = 'Kho dữ liệu' }) {
  const { lang } = useOutletContext();
  const [customers, setCustomers] = useState([]);
  
  const [selectedCustId, setSelectedCustId] = useState(null);
  const [interactionData, setInteractionData] = useState({ type: 'Cuộc gọi', note: '' });

  // 1. TẢI DỮ LIỆU LẦN ĐẦU KHI MỞ TRANG (Tránh lỗi React)
  useEffect(() => { 
    const loadInitialData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customers`);
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };
    loadInitialData();
  }, []);

  // 2. HÀM TẢI LẠI (Dùng cho các nút bấm chuyển trạng thái/lưu nhật ký)
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customers`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/customers/${id}/status`, { status: newStatus });
      alert(`Đã chuyển trạng thái thành: ${newStatus}!`);
      fetchCustomers(); 
    } catch (error) {
      alert('Lỗi khi chuyển trạng thái!');
      console.error(error);
    }
  };

  const handleSaveInteraction = async () => {
    if (!interactionData.note) return alert('Vui lòng nhập nội dung trao đổi!');
    try {
      await axios.post(`${API_URL}/api/customers/${selectedCustId}/interaction`, interactionData);
      alert('Đã lưu nhật ký chăm sóc thành công!');
      setSelectedCustId(null); 
      setInteractionData({ type: 'Cuộc gọi', note: '' });
      fetchCustomers(); 
    } catch (error) {
      alert('Có lỗi khi lưu nhật ký!');
      console.error(error);
    }
  };

  const i18n = {
    vi: { col1: "Công ty", col2: "Mã số thuế", col3: "Liên hệ", col4: "Dịch vụ", col5: "Hành động", btnMovePotential: "⭐ Đánh dấu Tiềm năng", btnRemovePotential: "🔙 Bỏ Tiềm năng", empty: "Không có dữ liệu." },
    en: { col1: "Company", col2: "Tax Code", col3: "Contact", col4: "Service", col5: "Action", btnMovePotential: "⭐ Mark Potential", btnRemovePotential: "🔙 Remove Potential", empty: "No data available." }
  };
  const t = i18n[lang] || i18n.vi;

  const filteredCustomers = type === 'Kho dữ liệu' 
    ? customers.filter(c => c.status !== 'Tiềm năng') 
    : customers.filter(c => c.status === 'Tiềm năng');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ margin: 0, color: '#333' }}>{type === 'Kho dữ liệu' ? 'Kho dữ liệu khách hàng' : 'Khách hàng tiềm năng'}</h2>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>{t.col1}</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>{t.col3}</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px' }}>{t.col4}</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px', width: '20%' }}>Nhật ký (Gần nhất)</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '10px', width: '200px' }}>{t.col5}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>{t.empty}</td></tr>
            ) : (
              filteredCustomers.map((cust) => {
                const lastLog = cust.interactionHistory && cust.interactionHistory.length > 0 
                  ? cust.interactionHistory[cust.interactionHistory.length - 1] 
                  : null;

                return (
                  <tr key={cust._id}>
                    <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}><b>{cust.companyName}</b><br/><span style={{fontSize:'12px', color:'#888'}}>MST: {cust.taxCode}</span></td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{cust.contactPerson} <br/> {cust.phone}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{cust.serviceType}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '10px', fontSize: '13px', color: '#555' }}>
                      {lastLog ? <span><b>[{lastLog.type}]</b>: {lastLog.note}</span> : <span style={{color: '#ccc'}}>Chưa có tương tác</span>}
                    </td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                        <button onClick={() => setSelectedCustId(cust._id)} style={{ padding: '6px 10px', backgroundColor: '#e9ecef', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>📝 Nhật ký chăm sóc</button>
                        {type === 'Kho dữ liệu' ? (
                          <button onClick={() => handleUpdateStatus(cust._id, 'Tiềm năng')} style={{ padding: '6px 10px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t.btnMovePotential}</button>
                        ) : (
                          <button onClick={() => handleUpdateStatus(cust._id, 'Kho dữ liệu')} style={{ padding: '6px 10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{t.btnRemovePotential}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedCustId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Nhập nhật ký chăm sóc</h3>
            <label>Loại tương tác:</label>
            <select value={interactionData.type} onChange={(e) => setInteractionData({...interactionData, type: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '15px', marginTop: '5px' }}>
              <option value="Cuộc gọi">📞 Cuộc gọi</option>
              <option value="Email">📧 Gửi Email Báo giá</option>
              <option value="Cuộc gặp">🤝 Cuộc gặp mặt</option>
            </select>
            <label>Nội dung trao đổi:</label>
            <textarea rows="4" value={interactionData.note} onChange={(e) => setInteractionData({...interactionData, note: e.target.value})} placeholder="Khách phản hồi như thế nào..." style={{ width: '100%', padding: '8px', marginBottom: '15px', marginTop: '5px' }}></textarea>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedCustId(null)} style={{ padding: '8px 15px', border: 'none', backgroundColor: '#ccc', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSaveInteraction} style={{ padding: '8px 15px', border: 'none', backgroundColor: '#0d6efd', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Nhật Ký</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;