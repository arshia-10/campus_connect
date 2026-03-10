import React from 'react';

export default function CompanyAvatar({ initial, color, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25,
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, flexShrink: 0,
      fontSize: initial.length > 1 ? size * 0.28 : size * 0.38,
    }}>
      {initial}
    </div>
  );
}
