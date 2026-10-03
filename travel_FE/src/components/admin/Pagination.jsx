import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1 && !totalItems) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px',
        color: '#666',
      }}
    >
      <div>
        {totalItems !== undefined && itemsPerPage !== undefined ? (
          <span>
            Hiển thị từ{' '}
            <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</strong> đến{' '}
            <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong> trên{' '}
            <strong>{totalItems}</strong> mục
          </span>
        ) : (
          <span>
            Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            background: '#fff',
            border: '1px solid #d2d6de',
            borderRadius: '3px',
            color: currentPage <= 1 ? '#ccc' : '#444',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              padding: '6px 12px',
              background: currentPage === p ? '#00c0ef' : '#fff',
              border: `1px solid ${currentPage === p ? '#00c0ef' : '#d2d6de'}`,
              borderRadius: '3px',
              color: currentPage === p ? '#fff' : '#444',
              fontWeight: currentPage === p ? 700 : 400,
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            background: '#fff',
            border: '1px solid #d2d6de',
            borderRadius: '3px',
            color: currentPage >= totalPages ? '#ccc' : '#444',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
