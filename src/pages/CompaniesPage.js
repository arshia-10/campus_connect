import React, { useState } from 'react';
import { COMPANIES } from '../data/jobs';
import CompanyAvatar from '../components/common/CompanyAvatar';
import Footer from '../components/common/Footer';

export default function CompaniesPage({ t, dark, setPage }) {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');

  const sectors = ['All', ...new Set(COMPANIES.map(c => c.sector))];

  const filtered = COMPANIES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === 'All' || c.sector === sector;
    return matchSearch && matchSector;
  });

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>Companies</h1>
          <p style={{ fontSize: 15, color: t.textMuted }}>Explore all companies actively recruiting on campus</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200, background: t.input, borderColor: t.inputBorder }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: t.text, fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sectors.map(s => (
              <button key={s} onClick={() => setSector(s)} className="btn btn-sm"
                style={{
                  background: sector === s ? '#1a3a5c' : t.surface,
                  color: sector === s ? '#fff' : t.textMuted,
                  border: `1px solid ${sector === s ? '#1a3a5c' : t.border}`,
                  borderRadius: 8,
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((co, i) => (
            <div key={co.name} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div
                style={{
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 14, padding: '24px', cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.18s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,58,92,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                onClick={() => setPage('jobs')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <CompanyAvatar initial={co.initial} color={co.color} size={52} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>{co.name}</div>
                    <div style={{ fontSize: 13, color: t.textMuted }}>{co.sector}</div>
                  </div>
                  <span style={{ background: t.statIcon, color: '#2ea87e', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {co.roles} open
                  </span>
                </div>
                <button className="btn btn-sm" style={{ width: '100%', padding: '9px', background: t.bgAlt, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 8 }}>
                  View Openings →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: t.textMuted }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🏢</div>
            No companies found.
          </div>
        )}
      </div>
      <Footer dark={dark} t={t} />
    </div>
  );
}
