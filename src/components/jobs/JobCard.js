import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CompanyAvatar from '../common/CompanyAvatar';
import StatusBadge from '../common/StatusBadge';

export default function JobCard({ job, dark, t, onNeedLogin, onApplySuccess }) {
  const { user, applyToJob, toggleSaveJob, hasApplied, isSaved } = useAuth();
  const [applyModal, setApplyModal] = useState(false);

  const applied = hasApplied(job.id);
  const saved   = isSaved(job.id);

  const handleApply = () => {
    if (!user) { onNeedLogin(); return; }
    if (applied || job.status === 'closed') return;
    setApplyModal(true);
  };

  const confirmApply = () => {
    applyToJob(job.id);
    setApplyModal(false);
    onApplySuccess?.();
  };

  return (
    <>
      <div className="fade-up" style={{
        background: t.surface, border: `1px solid ${applied ? '#2ea87e' : t.border}`,
        borderRadius: 14, padding: '22px', marginBottom: 14,
        borderLeft: applied ? '3px solid #2ea87e' : `3px solid transparent`,
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,58,92,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <CompanyAvatar initial={job.initial} color={job.color} size={48} />

          <div style={{ flex: 1 }}>
            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 2 }}>{job.title}</div>
                <div style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>{job.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: '#2ea87e' }}>
                  {job.salary}
                </div>
                <div style={{ fontSize: 13, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                  📍 {job.location}
                </div>
                <div style={{ fontSize: 13, color: t.textMuted }}>💼 {job.type}</div>
                <div style={{ fontSize: 12, color: t.textFaint }}>🕒 {job.posted}</div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: t.textMuted, margin: '10px 0', lineHeight: 1.65 }}>
              {job.description}
            </p>

            {/* Skills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {job.skills.map(s => (
                <span key={s} className="tag" style={{ background: t.tagBg, color: t.tagText }}>{s}</span>
              ))}
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: t.textMuted }}>
                  👥 {job.applicants} applicants · {job.exp}
                </span>
                <StatusBadge status={job.status} dark={dark} />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {/* Save button */}
                <button
                  onClick={() => { if (!user) { onNeedLogin(); return; } toggleSaveJob(job.id); }}
                  className="btn"
                  style={{
                    background: 'none',
                    border: `1.5px solid ${saved ? '#2ea87e' : t.border}`,
                    borderRadius: 8, padding: '7px 10px',
                    color: saved ? '#2ea87e' : t.textMuted,
                    fontSize: 15, transition: 'all 0.18s',
                  }}
                  title={saved ? 'Unsave' : 'Save job'}
                >
                  {saved ? '🔖' : '📄'}
                </button>

                {/* Apply button */}
                <button
                  onClick={handleApply}
                  disabled={job.status === 'closed' || applied}
                  className="btn btn-primary btn-sm"
                  style={{
                    background: applied ? '#2ea87e' : job.status === 'closed' ? '#9ca3af' : '#1a3a5c',
                    padding: '8px 20px',
                  }}
                >
                  {applied ? '✓ Applied' : job.status === 'closed' ? 'Closed' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {applyModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setApplyModal(false)}>
          <div className="modal-box slide-in" style={{ background: t.surface, maxWidth: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🚀</div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: t.text, marginBottom: 8 }}>
                Confirm Application
              </h2>
              <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.6 }}>
                Apply for <strong style={{ color: t.text }}>{job.title}</strong> at <strong style={{ color: t.text }}>{job.company}</strong>?
              </p>
            </div>

            <div style={{ background: t.bgAlt, borderRadius: 10, padding: '14px 16px', marginBottom: 20, border: `1px solid ${t.border}` }}>
              {[
                ['Package',  job.salary],
                ['Location', job.location],
                ['Type',     job.type],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: t.textMuted }}>{k}</span>
                  <span style={{ color: k === 'Package' ? '#2ea87e' : t.text, fontWeight: 600, fontFamily: k === 'Package' ? "'JetBrains Mono', monospace" : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setApplyModal(false)} className="btn btn-outline" style={{ flex: 1, padding: 11 }}>Cancel</button>
              <button onClick={confirmApply} className="btn btn-accent" style={{ flex: 1, padding: 11 }}>Confirm Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
