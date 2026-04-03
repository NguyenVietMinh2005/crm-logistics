import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { API_URL } from '../api';

const StatBlock = ({ title, labelTarget, labelActual, labelDiff, targetValue = 0, actualValue = 0 }) => {
  const statBoxStyle = { flex: 1, padding: '15px', textAlign: 'center', borderRadius: '4px', color: 'white', fontSize: '13px' };
  const diffValue = actualValue - targetValue;

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>{title}</h4>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ ...statBoxStyle, backgroundColor: '#0d6efd' }}>{labelTarget} <br/><b style={{fontSize: '18px'}}>{targetValue}</b></div>
        <div style={{ ...statBoxStyle, backgroundColor: '#28a745' }}>{labelActual} <br/><b style={{fontSize: '18px'}}>{actualValue}</b></div>
        <div style={{ ...statBoxStyle, backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}>
          {labelDiff} <br/>
          <b style={{fontSize: '18px', color: diffValue >= 0 ? '#28a745' : '#dc3545'}}>
            {diffValue > 0 ? `+${diffValue}` : diffValue}
          </b>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const { lang } = useOutletContext();
  
  const [stats, setStats] = useState({
    tongTiemNang: 0,
    soCuocGoi: 0,
    soEmail: 0,
    soCuocGap: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customers`);
        const data = response.data.data;

        const tiemNang = data.filter(c => c.status === 'Tiềm năng').length;
        let goi = 0, mail = 0, gap = 0;
        
        data.forEach(cust => {
          if (cust.interactionHistory) {
            cust.interactionHistory.forEach(log => {
              if (log.type === 'Cuộc gọi') goi++;
              if (log.type === 'Email') mail++;
              if (log.type === 'Cuộc gặp') gap++;
            });
          }
        });

        setStats({ tongTiemNang: tiemNang, soCuocGoi: goi, soEmail: mail, soCuocGap: gap });
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard", error);
      }
    };
    fetchStats();
  }, []);

  // ĐÃ FIX: Khôi phục lại biến i18n để sử dụng tham số lang
  const i18n = {
    vi: { copyBtn: "🔗 Copy Link Gửi Khách Hàng", box1: "Tổng Cuộc Gọi", box2: "Tổng Email Báo Giá", stat1: "Số cuộc gọi khách hàng/Ngày", stat2: "Số khách hàng mới tiềm năng", stat3: "Cuộc gặp khách hàng/Tuần", stat4: "Số lượng gửi email báo giá", target: "MỤC TIÊU", actual: "THỰC TẾ", diff: "CHÊNH LỆCH" },
    en: { copyBtn: "🔗 Copy Customer Form Link", box1: "Total Calls", box2: "Total Quote Emails", stat1: "New customer calls/Day", stat2: "Potential new customers", stat3: "Customer meetings/Week", stat4: "Quote emails sent", target: "TARGET", actual: "ACTUAL", diff: "DIFFERENCE" }
  };
  const t = i18n[lang] || i18n.vi;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/form'); alert('Đã copy!'); }} style={{ padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {t.copyBtn}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, backgroundColor: '#0d6efd', color: 'white', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>{t.box1}</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.soCuocGoi}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#0d6efd', color: 'white', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>{t.box2}</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.soEmail}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <StatBlock title={t.stat1} labelTarget={t.target} labelActual={t.actual} labelDiff={t.diff} targetValue={20} actualValue={stats.soCuocGoi} />
        <StatBlock title={t.stat2} labelTarget={t.target} labelActual={t.actual} labelDiff={t.diff} targetValue={5} actualValue={stats.tongTiemNang} />
        <StatBlock title={t.stat3} labelTarget={t.target} labelActual={t.actual} labelDiff={t.diff} targetValue={3} actualValue={stats.soCuocGap} />
        <StatBlock title={t.stat4} labelTarget={t.target} labelActual={t.actual} labelDiff={t.diff} targetValue={10} actualValue={stats.soEmail} />
      </div>
    </div>
  );
}

export default Dashboard;