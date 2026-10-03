import React from 'react';
import { ArrowUp } from 'lucide-react';

const StatCard = ({ icon, title, value, unit, isRevenue = false, trend = true }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e9ec',
        borderRadius: '4px',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {/* Title + Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#666',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        {icon && <span style={{ display: 'flex', alignItems: 'center', color: '#888' }}>{icon}</span>}
        <span>{title}</span>
      </div>

      {/* Value */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          color: isRevenue ? '#e53935' : '#00897b',
        }}
      >
        {!isRevenue && trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#00897b',
            }}
          >
            <ArrowUp size={24} strokeWidth={3} />
          </span>
        )}
        <span
          style={{
            fontSize: isRevenue ? '26px' : '32px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: isRevenue ? '#e53935' : '#00897b',
              textTransform: 'lowercase',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
