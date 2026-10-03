import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ fontSize: '16px', color: '#64748b' }}>Đang kiểm tra quyền truy cập Quản trị...</div>
      </div>
    );
  }

  const currentUser = authService.getCurrentUser();
  const adminToken = authService.getAdminToken();
  const adminUser = authService.getAdminUser();

  // 1. CHẶN KHÁCH HÀNG: Nếu đang đăng nhập bằng tài khoản Khách hàng (role !== 'admin')
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '24px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '20px'
          }}>
            ⛔
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            Quyền truy cập bị từ chối (403)
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            Bạn đang đăng nhập bằng tài khoản Khách hàng <strong>{currentUser.name ? `"${currentUser.name}"` : ''} ({currentUser.email})</strong>. Khu vực này chỉ dành riêng cho Quản trị viên hệ thống.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                padding: '11px 22px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Về Trang chủ
            </button>
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/admin/login';
              }}
              style={{
                padding: '11px 22px',
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Đăng xuất & Đăng nhập Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. CHẶN VÃNG LAI: Nếu chưa đăng nhập Admin hoặc Token Admin không tồn tại
  if (!adminToken || !adminUser || adminUser.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
