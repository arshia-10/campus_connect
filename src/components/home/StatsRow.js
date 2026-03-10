import React from 'react';
import { STATS } from '../../data/jobs';

export default function StatsRow({ t }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {STATS.map((s, i) => (
        <div key={s.label} className="stat-card fade-up"
          style={{
            background: t.surface, border: `1px solid ${t.border}`,
            animationDelay: `${i * 0.08}s`, flex: 1, minWidth: 160,
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: t.statIcon,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{s.icon}</div>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22, fontWeight: 700, color: '#2ea87e',
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
