import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Wrench, X, RefreshCw, Download } from 'lucide-react';

const DonutChartSVG = ({ data, size = 180, strokeWidth = 34 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((acc, item) => acc + item.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {data.map((item, idx) => {
          const percent = item.value / total;
          const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
          const strokeDashoffset = -circumference * accumulatedPercent;
          accumulatedPercent += percent;

          const isHovered = hoveredIdx === idx;

          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                cursor: 'pointer',
                opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1,
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </svg>
      {/* Center cutout info */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {hoveredIdx !== null ? (
          <>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>{data[hoveredIdx].name}</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: data[hoveredIdx].color }}>
              {data[hoveredIdx].percentage}%
            </span>
          </>
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>100%</span>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  subtitle,
  data = [],
  layout = 'side', // 'side' (like Điểm đến) or 'bottom' (like Đặt tour)
  onRefresh,
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
        height: '100%',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#444', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
            title="Thu nhỏ / Mở rộng"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
            title="Tùy chọn"
          >
            <Wrench size={14} />
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

      {!collapsed && (
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                color: '#777',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{subtitle}</span>
              {layout === 'bottom' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onRefresh && (
                    <button
                      onClick={onRefresh}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                      title="Làm mới"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                  <button
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                    title="Tải xuống"
                  >
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {layout === 'side' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '20px',
                flex: 1,
              }}
            >
              <DonutChartSVG data={data} size={170} strokeWidth={32} />

              <div style={{ minWidth: '160px', flex: 1 }}>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                      <th style={{ textAlign: 'left', paddingBottom: '8px', fontWeight: 500 }}>Tên</th>
                      <th style={{ textAlign: 'right', paddingBottom: '8px', fontWeight: 500 }}>Phần Trăm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #fafafa' }}>
                        <td style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '2px',
                              backgroundColor: item.color,
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ color: '#444' }}>{item.name}</span>
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: 600, color: '#333' }}>
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', flex: 1 }}>
              <DonutChartSVG data={data} size={170} strokeWidth={32} />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  width: '100%',
                }}
              >
                {data.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: item.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ color: '#555' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
