import React from 'react';
import { X, User, Mail, Shield, Activity, Calendar } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const UserDetail = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '6px',
          width: '90%',
          maxWidth: '520px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0 }}>
            Chi tiết Người dùng
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Avatar and Main Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`}
              alt={user.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2px solid #00c0ef',
              }}
            />
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#222', margin: '0 0 4px 0' }}>
                {user.name || 'Chưa đặt tên'}
              </h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <StatusBadge status={user.role || 'user'} type="role" />
                <StatusBadge status={user.status || 'active'} type="userStatus" />
              </div>
            </div>
          </div>

          {/* Details List (Matches Backend User Model fields strictly) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '14px',
              backgroundColor: '#fcfcfc',
              border: '1px solid #eee',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} /> ID:
              </span>
              <strong style={{ color: '#333', wordBreak: 'break-all' }}>{user._id || user.id}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} /> Họ và tên:
              </span>
              <span style={{ color: '#333' }}>{user.name}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} /> Email:
              </span>
              <span style={{ color: '#333' }}>{user.email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} /> Vai trò:
              </span>
              <span style={{ color: '#333', textTransform: 'capitalize' }}>{user.role || 'user'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={15} /> Trạng thái:
              </span>
              <span style={{ color: '#333', textTransform: 'capitalize' }}>{user.status || 'active'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} /> Ngày tạo:
              </span>
              <span style={{ color: '#555' }}>
                {formatDate(user.createdAt || user.timestamps?.createdAt)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: '#888', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} /> Cập nhật:
              </span>
              <span style={{ color: '#555' }}>
                {formatDate(user.updatedAt || user.timestamps?.updatedAt || user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#00c0ef',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
