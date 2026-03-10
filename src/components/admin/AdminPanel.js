import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobsContext';
import StatusBadge from '../common/StatusBadge';
import CompanyAvatar from '../common/CompanyAvatar';

const EMPTY_JOB = {
  title: '', company: '', sector: 'Technology', salary: '', salaryMin: 0,
  location: '', type: 'Full-time', exp: 'Fresher', description: '',
  skills: '', status: 'open', color: '#1a3a5c', initial: '',
};

export default function AdminPanel({ t, dark }) {
  const { user, getAllApplicants, updateApplicantStatus } = useAuth();
  const { allJobs, adminJobs, addJob, removeJob, updateJobStatus } = useJobs();
  const [activeTab, setActiveTab] = useState('overview');
  const [form,      setForm]      = useState(EMPTY_JOB);
  const [postMsg,   setPostMsg]   = useState('');
  const [postErr,   setPostErr]   = useState('');

  if (!user || user.role !== 'TPO/Admin') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: t.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: t.text }}>Admin Access Required</div>
      </div>
    );
  }

  const applicants = getAllApplicants();

  const handlePost = () => {
    setPostErr('');
    if (!form.title || !form.company || !form.salary || !form.location || !form.description) {
      setPostErr('Please fill all required fields.'); return;
    }
    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    addJob({
      ...form,
      skills,
      initial: form.company.slice(0, 2).toUpperCase(),
      applicants: 0,
      posted: 'Just now',
    });
    setForm(EMPTY_JOB);
    setPostMsg('Job posted successfully!');
    setTimeout(() => setPostMsg(''), 3000);
  };

  const TABS = [
    { id: 'overview',    label: '📊 Overview'    },
    { id: 'jobs',        label: '💼 Manage Jobs' },
    { id: 'post',        label: '➕ Post Job'    },
    { id: 'applicants',  label: '👥 Applicants'  },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
            🛡️ Admin Panel
          </h1>
          <p style={{ fontSize: 14, color: t.textMuted }}>Placement Control Desk · {user.name}</p>
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
                { label: 'Total Jobs',      value: allJobs.length,                                      icon: '💼', color: '#3b6fd4' },
                { label: 'Open Drives',     value: allJobs.filter(j => j.status === 'open').length,      icon: '🚀', color: '#2ea87e' },
                { label: 'Total Applicants',value: applicants.length,                                    icon: '👥', color: '#f59e0b' },
                { label: 'Posted by Admin', value: adminJobs.length,                                     icon: '📝', color: '#8b5cf6' },
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

            {/* Quick summary */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 14 }}>Job Status Summary</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['open', 'interviewing', 'closed'].map(s => {
                  const count = allJobs.filter(j => j.status === s).length;
                  return (
                    <div key={s} style={{ flex: 1, minWidth: 100, background: t.bgAlt, borderRadius: 10, padding: '14px', textAlign: 'center', border: `1px solid ${t.border}` }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: s === 'open' ? '#2ea87e' : s === 'interviewing' ? '#f59e0b' : '#ef4444' }}>{count}</div>
                      <div style={{ fontSize: 12, color: t.textMuted, textTransform: 'capitalize', marginTop: 4 }}>{s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Manage Jobs ── */}
        {activeTab === 'jobs' && (
          <div className="fade-in">
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>All Jobs ({allJobs.length})</div>
              </div>
              <table className={`table${dark ? ' table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>Company</th><th>Role</th><th>Location</th><th>Package</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map(job => (
                    <tr key={job.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CompanyAvatar initial={job.initial} color={job.color} size={30} />
                          <span style={{ fontWeight: 600, color: t.text }}>{job.company}</span>
                        </div>
                      </td>
                      <td style={{ color: t.text }}>{job.title}</td>
                      <td style={{ color: t.textMuted }}>{job.location}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2ea87e', fontSize: 13 }}>{job.salary}</td>
                      <td><StatusBadge status={job.status} dark={dark} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {adminJobs.find(j => j.id === job.id) && (
                            <>
                              <select
                                value={job.status}
                                onChange={e => updateJobStatus(job.id, e.target.value)}
                                className={`select${dark ? ' select-dark' : ''}`}
                                style={{ padding: '4px 28px 4px 8px', fontSize: 12 }}
                              >
                                <option value="open">Open</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="closed">Closed</option>
                              </select>
                              <button onClick={() => removeJob(job.id)} className="btn btn-sm"
                                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                                Delete
                              </button>
                            </>
                          )}
                          {!adminJobs.find(j => j.id === job.id) && (
                            <span style={{ fontSize: 12, color: t.textFaint, padding: '4px 8px' }}>Default</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Post Job ── */}
        {activeTab === 'post' && (
          <div className="fade-in">
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '28px', maxWidth: 640 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 22 }}>Post a New Job Drive</div>

              {postMsg && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {postMsg}</div>}
              {postErr && <div className="alert alert-error"   style={{ marginBottom: 16 }}>⚠️ {postErr}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Job Title *',    key: 'title',    span: 2, placeholder: 'Software Engineer' },
                  { label: 'Company Name *', key: 'company',  span: 1, placeholder: 'Google' },
                  { label: 'Sector',         key: 'sector',   span: 1, placeholder: 'Technology' },
                  { label: 'Package *',      key: 'salary',   span: 1, placeholder: '₹18–25 LPA' },
                  { label: 'Location *',     key: 'location', span: 1, placeholder: 'Bangalore' },
                  { label: 'Experience',     key: 'exp',      span: 1, placeholder: '0–2 years' },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>{f.label}</label>
                    <input className={`input${dark ? ' input-dark' : ''}`} placeholder={f.placeholder}
                      value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}

                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Job Type</label>
                  <select className={`select${dark ? ' select-dark' : ''}`} style={{ width: '100%' }}
                    value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option>Full-time</option><option>Internship</option><option>Part-time</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Status</label>
                  <select className={`select${dark ? ' select-dark' : ''}`} style={{ width: '100%' }}
                    value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="open">Open</option><option value="interviewing">Interviewing</option><option value="closed">Closed</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Skills Required (comma separated)</label>
                  <input className={`input${dark ? ' input-dark' : ''}`} placeholder="React, Node.js, Python"
                    value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Job Description *</label>
                  <textarea className={`input${dark ? ' input-dark' : ''}`}
                    placeholder="Describe the role and responsibilities..."
                    rows={4} style={{ resize: 'vertical' }}
                    value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setForm(EMPTY_JOB)} className="btn btn-ghost">Clear</button>
                <button onClick={handlePost} className="btn btn-accent" style={{ flex: 1, padding: '11px' }}>
                  📢 Post Job Drive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Applicants ── */}
        {activeTab === 'applicants' && (
          <div className="fade-in">
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>All Applicants ({applicants.length})</div>
              </div>
              {applicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: t.textMuted }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
                  No applicants yet.
                </div>
              ) : (
                <table className={`table${dark ? ' table-dark' : ''}`}>
                  <thead>
                    <tr><th>Student</th><th>Roll No</th><th>CGPA</th><th>Applied For</th><th>Status</th><th>Update</th></tr>
                  </thead>
                  <tbody>
                    {applicants.map((a, i) => {
                      const job = allJobs.find(j => j.id === a.jobId);
                      return (
                        <tr key={`${a.id}-${a.jobId}-${i}`}>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, color: t.text }}>{a.name}</div>
                              <div style={{ fontSize: 12, color: t.textMuted }}>{a.email}</div>
                            </div>
                          </td>
                          <td style={{ color: t.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{a.rollNo || '—'}</td>
                          <td style={{ color: '#2ea87e', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{a.cgpa || '—'}</td>
                          <td style={{ color: t.text }}>{job ? `${job.title} @ ${job.company}` : `Job #${a.jobId}`}</td>
                          <td><StatusBadge status={a.appStatus} dark={dark} /></td>
                          <td>
                            <select
                              value={a.appStatus || 'Applied'}
                              onChange={e => updateApplicantStatus(a.id, a.jobId, e.target.value)}
                              className={`select${dark ? ' select-dark' : ''}`}
                              style={{ padding: '4px 28px 4px 8px', fontSize: 12 }}
                            >
                              {['Applied', 'Shortlisted', 'Interviewing', 'Placed', 'Rejected'].map(s => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
