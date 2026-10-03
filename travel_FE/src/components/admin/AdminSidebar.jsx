import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Compass,
  CalendarCheck,
  Mail,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Trash2,
  List,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [toursSubmenuOpen, setToursSubmenuOpen] = useState(
    location.pathname.includes('/admin/tours')
  );

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/admin/dashboard',
    },
    {
      title: 'Quản lý Admin',
      icon: <ShieldCheck size={18} />,
      path: '/admin/admins',
    },
    {
      title: 'Quản lý người dùng',
      icon: <Users size={18} />,
      path: '/admin/users',
    },
    {
      title: 'Quản lý Tours',
      icon: <Compass size={18} />,
      path: '/admin/tours',
      hasSubmenu: true,
      subItems: [
        { title: 'Danh sách tour', path: '/admin/tours', icon: <List size={14} /> },
        { title: 'Thùng rác tour', path: '/admin/tours/trash', icon: <Trash2 size={14} /> },
      ],
    },
    {
      title: 'Quản lý Booking',
      icon: <CalendarCheck size={18} />,
      path: '/admin/bookings',
    },
    {
      title: 'Liên hệ',
      icon: <Mail size={18} />,
      path: '/admin/contact',
    },
  ];

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#222d32',
        color: '#b8c7ce',
        fontSize: '14px',
        userSelect: 'none',
      }}
    >
      {/* 1. Header Logo */}
      <div
        style={{
          height: '56px',
          backgroundColor: '#1e282c',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: '10px',
          borderBottom: '1px solid #1a2226',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#00c0ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <Sparkles size={18} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
          Admin
        </span>
      </div>

      {/* 2. User Info Profile Section */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #1a2226',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Admin Avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', color: '#8aa4af' }}>Xin chào,</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>

      {/* 3. Section Category Heading */}
      <div
        style={{
          padding: '14px 18px 8px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#4b646f',
          letterSpacing: '1px',
        }}
      >
        TỔNG QUAN
      </div>

      {/* 4. Menu Items */}
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, idx) => {
          if (item.hasSubmenu) {
            const isParentActive = location.pathname.startsWith('/admin/tours');
            return (
              <div key={idx}>
                <div
                  onClick={() => setToursSubmenuOpen(!toursSubmenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    color: isParentActive ? '#ffffff' : '#b8c7ce',
                    backgroundColor: isParentActive ? '#1e282c' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    borderLeft: isParentActive ? '3px solid #00c0ef' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isParentActive) e.currentTarget.style.backgroundColor = '#1e282c';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isParentActive) e.currentTarget.style.backgroundColor = 'transparent';
                    if (!isParentActive) e.currentTarget.style.color = '#b8c7ce';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {toursSubmenuOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </div>

                {toursSubmenuOpen && (
                  <div style={{ backgroundColor: '#2c3b41' }}>
                    {item.subItems.map((sub, sIdx) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <NavLink
                          key={sIdx}
                          to={sub.path}
                          onClick={isMobile ? onClose : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 18px 10px 42px',
                            fontSize: '13px',
                            color: isSubActive ? '#ffffff' : '#8aa4af',
                            backgroundColor: isSubActive ? '#1a2226' : 'transparent',
                            textDecoration: 'none',
                          }}
                        >
                          {sub.icon}
                          <span>{sub.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={idx}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                color: isActive ? '#ffffff' : '#b8c7ce',
                backgroundColor: isActive ? '#1e282c' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid #00c0ef' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#1e282c';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                if (!isActive) e.currentTarget.style.color = '#b8c7ce';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <span>{item.title}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
        {/* Drawer */}
        <div
          style={{
            position: 'relative',
            width: '240px',
            height: '100%',
            zIndex: 1001,
            animation: 'slideInLeft 0.25s ease-out',
          }}
        >
          {sidebarContent}
        </div>
        <style>{`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // Desktop fixed sidebar
  return (
    <aside
      style={{
        width: isOpen ? '240px' : '0px',
        minWidth: isOpen ? '240px' : '0px',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 900,
      }}
    >
      <div style={{ width: '240px', height: '100%' }}>{sidebarContent}</div>
    </aside>
  );
};

export default AdminSidebar;
