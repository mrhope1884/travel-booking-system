import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Đang tải dữ liệu...', minHeight = '200px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: '12px',
        color: '#666',
      }}
    >
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#00c0ef' }} />
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
