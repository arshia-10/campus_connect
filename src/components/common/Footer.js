import React from 'react';

export default function Footer({ dark, t }) {
  return (
    <footer style={{
      borderTop: `1px solid ${t.border}`,
      background: t.surface,
      padding: '32px 24px',
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#1a3a5c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>CampusConnect</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>Placement & Career Portal · AY 2024–25</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: t.textMuted }}>
          © 2025 CampusConnect. Built for campus placements.
        </div>
      </div>
    </footer>
  );
}
