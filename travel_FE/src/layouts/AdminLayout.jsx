import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'Quản lý người dùng';
    if (path.includes('/tours/trash')) return 'Thùng rác Tours';
    if (path.includes('/tours')) return 'Quản lý Tours';
    if (path.includes('/bookings')) return 'Quản lý Booking';
    if (path.includes('/admins')) return 'Quản lý Admin';
    if (path.includes('/contact')) return 'Liên hệ';
    return 'Hệ thống Quản trị';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* 1. Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* 2. Main Content Wrapper */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={getPageTitle()}
        />

        <main style={{ flex: 1, padding: '20px 24px' }}>
          <Outlet />
        </main>

        <footer
          style={{
            padding: '14px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e9ec',
            fontSize: '12px',
            color: '#777',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <strong>Bản quyền &copy; {new Date().getFullYear()} Travel Tour Admin.</strong> All rights reserved.
          </div>
          <div>
            <b>Phiên bản</b> 1.0.0
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
