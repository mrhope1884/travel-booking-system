import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'Không có dữ liệu nào.', actionText, onAction, minHeight = '180px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: '24px',
        color: '#888',
        gap: '12px',
      }}
    >
      <Inbox size={40} style={{ color: '#ccc' }} />
      <p style={{ fontSize: '14px', margin: 0 }}>{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '6px 14px',
            background: '#00c0ef',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
