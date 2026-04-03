import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [lang, setLang] = useState('vi');
  const [notifications] = useState([{ id: 1, text: 'Khách hàng mới A đã gửi form' }]);
  
  const [isCustomerOpen, setIsCustomerOpen] = useState(true);

  const i18n = {
    vi: { dash: "Dashboard", sim: "Sim/thẻ", agent: "Agent", call: "Cuộc gọi", cust: "Khách hàng", leads: "Tìm kiếm leads", omni: "Omni-channel", kb: "Thư viện kiến thức" },
    en: { dash: "Dashboard", sim: "SIM/Cards", agent: "Agent", call: "Calls", cust: "Customers", leads: "Search Leads", omni: "Omni-channel", kb: "Knowledge Base" }
  };
  const t = i18n[lang];

  const baseMenuItem = { padding: '12px 20px', cursor: 'pointer', color: '#555' };
  const activeMenuItem = { ...baseMenuItem, backgroundColor: '#e9f2ff', color: '#0d6efd', fontWeight: 'bold', borderLeft: '4px solid #0d6efd' };
  const baseSubMenu = { padding: '10px 20px 10px 45px', cursor: 'pointer', fontSize: '13px', color: '#666' };
  const activeSubMenu = { ...baseSubMenu, color: '#0d6efd', fontWeight: 'bold' };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', backgroundColor: '#ffffff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#333' }}>U&I</div>
        <div style={{ padding: '10px 20px', fontSize: '12px', color: '#888', fontWeight: 'bold', marginTop: '10px' }}>CRM</div>
        
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
            <li onClick={() => navigate('/')} style={location.pathname === '/' ? activeMenuItem : baseMenuItem}>📊 {t.dash}</li>
            <li style={baseMenuItem}>📱 {t.sim}</li>
            <li style={baseMenuItem}>👥 {t.agent}</li>
            <li style={baseMenuItem}>📞 {t.call}</li>
            
            <li onClick={() => setIsCustomerOpen(!isCustomerOpen)} style={location.pathname.includes('/customers') ? activeMenuItem : baseMenuItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🤝 {t.cust}</span>
                <span style={{ fontSize: '10px', marginTop: '4px' }}>{isCustomerOpen ? '▼' : '▶'}</span>
              </div>
            </li>

            {isCustomerOpen && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#fafafa' }}>
                <li onClick={() => navigate('/customers/warehouse')} style={location.pathname === '/customers/warehouse' ? activeSubMenu : baseSubMenu}>Kho dữ liệu khách hàng</li>
                <li onClick={() => navigate('/customers/potential')} style={location.pathname === '/customers/potential' ? activeSubMenu : baseSubMenu}>Khách hàng tiềm năng</li>
              </ul>
            )}

            <li style={baseMenuItem}>🔍 {t.leads}</li>
            
            {/* ĐÃ FIX: Gắn link cho Omni-channel */}
            <li 
              onClick={() => navigate('/omni-channel')} 
              style={location.pathname === '/omni-channel' ? activeMenuItem : baseMenuItem}
            >
              💬 {t.omni}
            </li>
            
            {/* ĐÃ FIX: Gắn link cho Thư viện kiến thức */}
            <li 
              onClick={() => navigate('/knowledge-base')} 
              style={location.pathname === '/knowledge-base' ? activeMenuItem : baseMenuItem}
            >
              📚 {t.kb}
            </li>
          </ul>
        </nav>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: '55px', backgroundColor: '#ffffff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CRM AI</span>
            <span style={{ color: '#888', fontSize: '14px' }}>CRM / {t.dash}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: '#555' }}>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px' }}>
              <option value="vi">🌐 Tiếng Việt</option>
              <option value="en">🌐 English</option>
            </select>
            <div style={{ position: 'relative', cursor: 'pointer' }}>🔔 <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{notifications.length}</span></div>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <Outlet context={{ lang }} /> 
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;