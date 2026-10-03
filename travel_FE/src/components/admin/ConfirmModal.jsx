import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onCancel,
  isLoading = false,
  isDanger = true,
}) => {
  if (!isOpen) return null;

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
          maxWidth: '460px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '16px', color: isDanger ? '#dd4b39' : '#333' }}>
            <AlertTriangle size={20} />
            <span>{title}</span>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
          {message}
        </div>

        <div
          style={{
            padding: '12px 20px',
            background: '#f9fafb',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              background: '#fff',
              border: '1px solid #d2d6de',
              borderRadius: '4px',
              color: '#444',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '8px 18px',
              background: isDanger ? '#dd4b39' : '#00c0ef',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
