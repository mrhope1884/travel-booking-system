import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const DataTable = ({
  title,
  subtitle,
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  emptyMessage = 'Không có dữ liệu nào để hiển thị.',
  renderRow,
  headerAction,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e9ec',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>{title}</h3>
          {subtitle && <span style={{ fontSize: '12px', color: '#888' }}>{subtitle}</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {headerAction}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
            title="Thu nhỏ / Mở rộng"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button
            onClick={() => setClosed(true)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
            title="Đóng thẻ"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <LoadingSpinner minHeight="160px" />
          ) : error ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#dc3545', fontSize: '13px' }}>
              ❌ Không thể tải dữ liệu: {error}
            </div>
          ) : !data || data.length === 0 ? (
            <EmptyState message={emptyMessage} minHeight="140px" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        textAlign: col.align || 'left',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        width: col.width || 'auto',
                      }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) =>
                  renderRow ? (
                    renderRow(item, index)
                  ) : (
                    <tr
                      key={item._id || item.id || index}
                      style={{
                        borderBottom: '1px solid #f2f4f6',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {columns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: '10px 14px',
                            textAlign: col.align || 'left',
                            color: '#444',
                          }}
                        >
                          {col.render ? col.render(item, index) : item[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
