import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onToggleSidebar, pageTitle = 'Dashboard' }) => {
  const { user, logout, admin, adminLogout } = useAuth();
  const currentAdmin = admin || user;
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (adminLogout) {
      adminLogout();
    } else {
      logout();
    }
    navigate('/admin/login');
  };

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e9ec',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 800,
      }}
    >
      {/* Left: Hamburger button + Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Thu gọn / Mở rộng menu"
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#333', margin: 0 }}>
          {pageTitle}
        </h1>
      </div>

      {/* Right: Notifications & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Success Alert / Badge (As seen in reference image) */}
        {showNotification && (
          <div
            onClick={() => setShowNotification(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#e8f5e9',
              border: '1px solid #c8e6c9',
              color: '#2e7d32',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            title="Nhấn để ẩn thông báo"
          >
            <CheckCircle2 size={15} color="#2e7d32" />
            <div>
              <strong style={{ display: 'block', fontSize: '11px', lineHeight: 1 }}>Success</strong>
              <span>Đăng nhập thành công</span>
            </div>
          </div>
        )}

        {/* Profile Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: dropdownOpen ? '#f5f5f5' : 'transparent',
              transition: 'background-color 0.15s',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Profile"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#444' }}>
              {user?.name || 'admin'}
            </span>
            <ChevronDown size={14} color="#777" />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e9ec',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '180px',
                overflow: 'hidden',
                zIndex: 1000,
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                  {currentAdmin?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {currentAdmin?.email || 'admin@travel.com'}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      backgroundColor: '#00c0ef',
                      color: '#fff',
                      borderRadius: '2px',
                      fontWeight: 700,
                    }}
                  >
                    {currentAdmin?.role || 'admin'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin/users');
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#555',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <User size={15} />
                <span>Hồ sơ người dùng</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid #eee',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#e53935',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={15} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
