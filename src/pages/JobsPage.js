import React, { useState } from 'react';
import JobCard    from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import Footer     from '../components/common/Footer';
import { useJobs } from '../context/JobsContext';

export default function JobsPage({ t, dark, onNeedLogin }) {
  const { allJobs } = useJobs();
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [locFilter,  setLocFilter]  = useState('All Locations');
  const [toast,      setToast]      = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = allJobs.filter(j => {
    const q = search.toLowerCase();
    const matchQ = !q || j.title.toLowerCase().includes(q)
      || j.company.toLowerCase().includes(q)
      || j.skills.some(s => s.toLowerCase().includes(q));
    const matchT = typeFilter === 'All Types'      || j.type     === typeFilter;
    const matchL = locFilter  === 'All Locations'  || j.location === locFilter;
    return matchQ && matchT && matchL;
  });

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)',
          background: '#2ea87e', color: '#fff', padding: '10px 22px',
          borderRadius: 10, fontWeight: 600, fontSize: 14, zIndex: 999,
          boxShadow: '0 4px 20px rgba(46,168,126,0.4)',
          animation: 'slideIn 0.3s ease',
        }}>
          ✅ {toast}
        </div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Job Openings
          </h1>
          <p style={{ fontSize: 15, color: t.textMuted }}>Discover opportunities tailored for you</p>
        </div>

        <JobFilters
          search={search}       setSearch={setSearch}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          locFilter={locFilter}   setLocFilter={setLocFilter}
          dark={dark} t={t}
        />

        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 18, fontWeight: 500 }}>
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: t.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 6 }}>No jobs found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your search or filters.</div>
          </div>
        ) : (
          filtered.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              dark={dark} t={t}
              onNeedLogin={onNeedLogin}
              onApplySuccess={() => showToast(`Applied to ${job.title} at ${job.company}!`)}
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))
        )}
      </div>

      <Footer dark={dark} t={t} />
    </div>
  );
}
