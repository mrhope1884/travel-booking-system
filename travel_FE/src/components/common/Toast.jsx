import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'success', title = 'Success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#28a745',
          icon: <CheckCircle2 size={18} color="#fff" />,
        };
      case 'error':
        return {
          bg: '#dc3545',
          icon: <AlertCircle size={18} color="#fff" />,
        };
      case 'warning':
        return {
          bg: '#ffc107',
          icon: <AlertCircle size={18} color="#212529" />,
        };
      default:
        return {
          bg: '#17a2b8',
          icon: <Info size={18} color="#fff" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        background: style.bg,
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        gap: '12px',
        minWidth: '240px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>{style.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '13px' }}>{title}</div>
        {message && <div style={{ fontSize: '12px', opacity: 0.95 }}>{message}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '2px',
            opacity: 0.8,
          }}
        >
          <X size={16} />
        </button>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
