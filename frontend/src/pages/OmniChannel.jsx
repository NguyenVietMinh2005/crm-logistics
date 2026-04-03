import React, { useState } from 'react';

// DỮ LIỆU MẪU (Seeding)
const MOCK_CONTACTS = [
  { id: 1, name: 'Công ty TNHH Hưng Phát', platform: 'Zalo', lastMsg: 'Bên em gửi báo giá cước biển qua mail chưa?', time: '10:30', unread: 2 },
  { id: 2, name: 'Anh Hải - XNK Vina', platform: 'Messenger', lastMsg: 'Cho anh hỏi thủ tục nhập khẩu máy phay CNC.', time: '09:15', unread: 0 },
  { id: 3, name: 'Chị Lan Logistics', platform: 'Zalo', lastMsg: 'Ok em, tiến hành mở tờ khai nhé.', time: 'Hôm qua', unread: 0 },
];

const MOCK_CHATS = {
  1: [
    { id: 101, sender: 'them', text: 'Chào em, anh đang cần check giá cước đường biển từ Thượng Hải về Hải Phòng.', time: '10:20' },
    { id: 102, sender: 'me', text: 'Dạ, anh cần check cước FCL hay LCL ạ? Lô hàng dự kiến đi ngày nào anh nhỉ?', time: '10:22' },
    { id: 103, sender: 'them', text: 'Đi FCL em nhé, 1 cont 20. Dự kiến tuần sau xuất.', time: '10:25' },
    { id: 104, sender: 'them', text: 'Bên em gửi báo giá cước biển qua mail chưa?', time: '10:30' }
  ],
  2: [
    { id: 201, sender: 'them', text: 'Chào bạn, công ty mình đang muốn nhập máy móc.', time: '09:10' },
    { id: 202, sender: 'them', text: 'Cho anh hỏi thủ tục nhập khẩu máy phay CNC.', time: '09:15' }
  ],
  3: [
    { id: 301, sender: 'me', text: 'Chị ơi, hồ sơ bên hải quan duyệt xong rồi nhé, chiều nay bên em cho xe lấy hàng.', time: '15:00' },
    { id: 302, sender: 'them', text: 'Ok em, tiến hành mở tờ khai nhé.', time: '15:30' }
  ]
};

function OmniChannel() {
  const [activeContactId, setActiveContactId] = useState(MOCK_CONTACTS[0].id);
  const [messageText, setMessageText] = useState('');
  
  // Lấy chi tiết lịch sử chat của người đang chọn
  const activeChat = MOCK_CHATS[activeContactId] || [];
  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      
      {/* CỘT TRÁI: DANH SÁCH TIN NHẮN (Giống Zalo) */}
      <div style={{ width: '320px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
        <div style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
          💬 Hộp thư Omni-channel
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MOCK_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setActiveContactId(contact.id)}
              style={{ 
                display: 'flex', padding: '15px', cursor: 'pointer', borderBottom: '1px solid #eee',
                backgroundColor: activeContactId === contact.id ? '#e9f2ff' : '#fff'
              }}
            >
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' }}>
                {contact.name.charAt(0)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <b style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.name}</b>
                  <span style={{ fontSize: '12px', color: '#888' }}>{contact.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '180px' }}>
                    [{contact.platform}] {contact.lastMsg}
                  </span>
                  {contact.unread > 0 && (
                    <span style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{contact.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: KHUNG CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#eef0f2' }}>
        
        {/* Header khung chat */}
        <div style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' }}>
            {activeContact?.name.charAt(0)}
          </div>
          <div>
            <b style={{ fontSize: '16px' }}>{activeContact?.name}</b>
            <div style={{ fontSize: '12px', color: '#28a745' }}>Đang hoạt động trên {activeContact?.platform}</div>
          </div>
        </div>

        {/* Vùng hiển thị tin nhắn */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeChat.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '60%', padding: '10px 15px', borderRadius: '15px', fontSize: '14px',
                backgroundColor: msg.sender === 'me' ? '#0d6efd' : '#fff',
                color: msg.sender === 'me' ? '#fff' : '#333',
                border: msg.sender === 'them' ? '1px solid #ddd' : 'none'
              }}>
                {msg.text}
                <div style={{ fontSize: '10px', marginTop: '5px', textAlign: 'right', opacity: 0.7 }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ô nhập tin nhắn */}
        <div style={{ padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
          <button style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>📎</button>
          <input 
            type="text" 
            placeholder={`Trả lời ${activeContact?.name} qua ${activeContact?.platform}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
          />
          <button style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            Gửi
          </button>
        </div>

      </div>
    </div>
  );
}

export default OmniChannel;