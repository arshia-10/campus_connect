import React from 'react';
import { COMPANIES } from '../../data/jobs';
import CompanyAvatar from '../common/CompanyAvatar';

export default function FeaturedRecruiters({ t, setPage }) {
  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Featured Recruiters
        </h2>
        <p style={{ fontSize: 15, color: t.textMuted }}>
          Top companies recruiting through our campus
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {COMPANIES.map((co, i) => (
          <div key={co.name}
            className="fade-up"
            onClick={() => setPage('companies')}
            style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,58,92,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <CompanyAvatar initial={co.initial} color={co.color} size={50} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{co.name}</div>
              <div style={{ fontSize: 13, color: t.textMuted }}>{co.sector}</div>
            </div>
            <span style={{
              background: t.statIcon, color: '#2ea87e',
              padding: '4px 10px', borderRadius: 20,
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {co.roles} roles
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
