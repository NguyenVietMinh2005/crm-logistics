import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import Customers from './pages/Customers';
import Login from './pages/Login';
import KnowledgeBase from './pages/KnowledgeBase';
import OmniChannel from './pages/OmniChannel';
// Component kiểm tra Token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Nếu không có token, tự động chuyển hướng về trang /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CÁC TRANG CÔNG KHAI */}
        <Route path="/form" element={<FormPage />} />
        <Route path="/login" element={<Login />} />

        {/* CÁC TRANG NỘI BỘ ĐÃ BỊ KHÓA BỞI ProtectedRoute */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="customers/warehouse" element={<Customers type="Kho dữ liệu" />} />
          <Route path="customers/potential" element={<Customers type="Tiềm năng" />} />
          {/* Đã thêm Route cho Thư viện kiến thức */}
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="omni-channel" element={<OmniChannel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;