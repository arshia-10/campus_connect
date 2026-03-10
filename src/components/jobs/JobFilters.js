import React from 'react';

export default function JobFilters({ search, setSearch, typeFilter, setTypeFilter, locFilter, setLocFilter, dark, t }) {
  const types = ['All Types', 'Full-time', 'Internship'];
  const locs  = ['All Locations', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Noida', 'Gurugram'];

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
      {/* Search */}
      <div className="search-bar" style={{ flex: 1, minWidth: 200, background: t.input, borderColor: t.inputBorder }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs or companies..."
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 14, color: t.text, fontFamily: 'inherit',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 16 }}>✕</button>
        )}
      </div>

      {/* Type filter */}
      <select
        value={typeFilter}
        onChange={e => setTypeFilter(e.target.value)}
        className={`select${dark ? ' select-dark' : ''}`}
      >
        {types.map(t => <option key={t}>{t}</option>)}
      </select>

      {/* Location filter */}
      <select
        value={locFilter}
        onChange={e => setLocFilter(e.target.value)}
        className={`select${dark ? ' select-dark' : ''}`}
      >
        {locs.map(l => <option key={l}>{l}</option>)}
      </select>
    </div>
  );
}
