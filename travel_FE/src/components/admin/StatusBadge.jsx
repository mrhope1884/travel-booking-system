import React from 'react';

const StatusBadge = ({ status, type = 'booking' }) => {
  let text = status;
  let bg = '#777';
  let color = '#fff';

  if (type === 'booking') {
    switch (status) {
      case 'confirmed':
        text = 'Đã xác nhận';
        bg = '#00a65a';
        break;
      case 'pending':
        text = 'Chưa xác nhận';
        bg = '#f39c12';
        break;
      case 'cancelled':
        text = 'Đã hủy';
        bg = '#dd4b39';
        break;
      default:
        text = status || 'Chưa xác nhận';
        bg = '#f39c12';
    }
  } else if (type === 'role') {
    switch (status) {
      case 'admin':
        text = 'Admin';
        bg = '#00c0ef';
        break;
      case 'staff':
        text = 'Nhân viên';
        bg = '#3c8dbc';
        break;
      case 'user':
        text = 'Khách hàng';
        bg = '#6c757d';
        break;
      default:
        text = status;
        bg = '#6c757d';
    }
  } else if (type === 'userStatus') {
    switch (status) {
      case 'active':
        text = 'Hoạt động';
        bg = '#00a65a';
        break;
      case 'inactive':
        text = 'Tạm khóa';
        bg = '#777777';
        break;
      default:
        text = status || 'Hoạt động';
        bg = '#00a65a';
    }
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: 600,
        lineHeight: 1,
        color,
        backgroundColor: bg,
        borderRadius: '3px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
};

export default StatusBadge;
