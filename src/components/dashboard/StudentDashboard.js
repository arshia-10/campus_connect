import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobsContext';
import StatusBadge from '../common/StatusBadge';
import CompanyAvatar from '../common/CompanyAvatar';

export default function StudentDashboard({ t, dark, setPage }) {
  const { user, updateProfile, toggleSaveJob } = useAuth();
  const { allJobs } = useJobs();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode,  setEditMode]  = useState(false);
  const [form, setForm] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    branch: user?.branch || '',
    cgpa:   user?.cgpa   || '',
    rollNo: user?.rollNo || '',
  });
  const [saved, setSaved] = useState('');
  const [resumeMessage, setResumeMessage] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  if (!user) return null;

  const appliedJobs = (user.appliedJobs || []).map(a => {
    const id = typeof a === 'object' ? a.jobId : a;
    const job = allJobs.find(j => j.id === id);
    return job ? { ...job, appStatus: typeof a === 'object' ? a.status : 'Applied', appliedAt: typeof a === 'object' ? a.appliedAt : '' } : null;
  }).filter(Boolean);

  const savedJobs = (user.savedJobs || []).map(id => allJobs.find(j => j.id === id)).filter(Boolean);

  const saveProfile = async () => {
    const result = await updateProfile(form);
    if (result.ok) {
      setEditMode(false);
      setSaved('Profile updated successfully!');
      setTimeout(() => setSaved(''), 3000);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await updateProfile({
        ...form,
        resume: {
          name: file.name,
          type: file.type,
          data: fileData,
          uploadedAt: new Date().toISOString(),
        },
      });

      if (result.ok) {
        setResumeMessage('Resume uploaded successfully!');
        setTimeout(() => setResumeMessage(''), 3000);
      }
    } finally {
      setUploadingResume(false);
      event.target.value = '';
    }
  };

  const TABS = [
    { id: 'overview',    label: '📊 Overview'     },
    { id: 'applications',label: '📋 Applications' },
    { id: 'saved',       label: '🔖 Saved Jobs'   },
    { id: 'profile',     label: '👤 Profile'      },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2ea87e, #1a3a5c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 24,
          }}>{user.name.charAt(0)}</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: t.text, letterSpacing: '-0.02em' }}>
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <div style={{ fontSize: 14, color: t.textMuted }}>
              {user.role} · {user.branch || 'Campus'} · {user.rollNo || user.email}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: t.bgAlt, padding: 4, borderRadius: 12, width: 'fit-content' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
              background: activeTab === tab.id ? t.surface : 'transparent',
              color: activeTab === tab.id ? t.text : t.textMuted,
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.18s',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Applications',  value: appliedJobs.length, icon: '📋', color: '#3b6fd4' },
                { label: 'Saved Jobs',    value: savedJobs.length,   icon: '🔖', color: '#f59e0b' },
                { label: 'CGPA',          value: user.cgpa || '—',   icon: '🎓', color: '#2ea87e' },
                { label: 'Active Drives', value: allJobs.filter(j => j.status === 'open').length, icon: '🚀', color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent applications */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>Recent Applications</div>
              {appliedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: t.textMuted }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  No applications yet.
                  <button className="btn btn-primary btn-sm" onClick={() => setPage('jobs')} style={{ display: 'block', margin: '12px auto 0' }}>Browse Jobs</button>
                </div>
              ) : (
                appliedJobs.slice(0, 4).map(job => (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
                    <CompanyAvatar initial={job.initial} color={job.color} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: t.textMuted }}>{job.company} · {job.location}</div>
                    </div>
                    <StatusBadge status={job.appStatus || 'Applied'} dark={dark} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Applications ── */}
        {activeTab === 'applications' && (
          <div className="fade-in">
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>My Applications ({appliedJobs.length})</div>
              </div>
              {appliedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: t.textMuted }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                  <div style={{ fontWeight: 600, color: t.text, marginBottom: 8 }}>No applications yet</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setPage('jobs')}>Browse Jobs</button>
                </div>
              ) : (
                <table className={`table${dark ? ' table-dark' : ''}`}>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Location</th>
                      <th>Package</th>
                      <th>Status</th>
                      <th>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map(job => (
                      <tr key={job.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CompanyAvatar initial={job.initial} color={job.color} size={30} />
                            <span style={{ fontWeight: 600 }}>{job.company}</span>
                          </div>
                        </td>
                        <td style={{ color: t.text }}>{job.title}</td>
                        <td style={{ color: t.textMuted }}>{job.location}</td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2ea87e', fontSize: 13 }}>{job.salary}</td>
                        <td><StatusBadge status={job.appStatus || 'Applied'} dark={dark} /></td>
                        <td style={{ color: t.textFaint, fontSize: 12 }}>{job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Saved Jobs ── */}
        {activeTab === 'saved' && (
          <div className="fade-in">
            {savedJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: t.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔖</div>
                <div style={{ fontWeight: 600, color: t.text, marginBottom: 8 }}>No saved jobs</div>
                <button className="btn btn-primary btn-sm" onClick={() => setPage('jobs')}>Browse Jobs</button>
              </div>
            ) : (
              savedJobs.map(job => (
                <div key={job.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <CompanyAvatar initial={job.initial} color={job.color} size={46} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: t.text }}>{job.title}</div>
                    <div style={{ fontSize: 13, color: t.textMuted }}>{job.company} · {job.location} · {job.salary}</div>
                  </div>
                  <button onClick={() => toggleSaveJob(job.id)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>Remove</button>
                  <button onClick={() => setPage('jobs')} className="btn btn-primary btn-sm">Apply</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Profile ── */}
        {activeTab === 'profile' && (
          <div className="fade-in">
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '28px', maxWidth: 560 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: t.text }}>Profile Information</div>
                <button onClick={() => setEditMode(e => !e)} className="btn btn-outline btn-sm">
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {saved && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {saved}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Full Name',    key: 'name',   type: 'text' },
                  { label: 'Phone',        key: 'phone',  type: 'tel'  },
                  { label: 'Branch',       key: 'branch', type: 'text' },
                  { label: 'CGPA',         key: 'cgpa',   type: 'text' },
                  { label: 'Roll Number',  key: 'rollNo', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.label}
                    </label>
                    {editMode ? (
                      <input className={`input${dark ? ' input-dark' : ''}`} type={f.type}
                        value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    ) : (
                      <div style={{ fontSize: 15, color: t.text, fontWeight: 500, padding: '8px 0' }}>
                        {user[f.key] || <span style={{ color: t.textFaint }}>Not provided</span>}
                      </div>
                    )}
                  </div>
                ))}

                {/* Email — read-only */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <div style={{ fontSize: 15, color: t.textMuted }}>{user.email}</div>
                </div>

                {/* Resume */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resume</label>
                  {user.resume?.name ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 15, color: t.text, fontWeight: 500 }}>
                        📄 {user.resume.name}
                      </div>
                      <a
                        href={user.resume.data}
                        download={user.resume.name}
                        style={{ color: '#2ea87e', fontWeight: 600, fontSize: 14 }}
                      >
                        Download Resume
                      </a>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button
                          onClick={async () => {
                            const res = await updateProfile({ resume: null });
                            if (res.ok) {
                              setResumeMessage('Resume removed');
                              setTimeout(() => setResumeMessage(''), 2500);
                            }
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ef4444' }}
                        >
                          Delete Resume
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 15, color: t.textFaint }}>No resume uploaded</div>
                  )}
                  <div style={{ marginTop: 10 }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ fontSize: 13, color: t.textMuted }}
                    />
                    {uploadingResume && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>Uploading resume...</div>}
                    {resumeMessage && <div style={{ fontSize: 12, color: '#2ea87e', marginTop: 6 }}>{resumeMessage}</div>}
                  </div>
                </div>

                {editMode && (
                  <button onClick={saveProfile} className="btn btn-accent" style={{ marginTop: 8 }}>
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
