import React, { useState } from 'react';
import JobCard    from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import Footer     from '../components/common/Footer';
import { useJobs } from '../context/JobsContext';
import { useAuth } from '../context/AuthContext';

export default function JobsPage({ t, dark, onNeedLogin }) {
  const { allJobs, addJob } = useJobs();
  const { user } = useAuth();
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [locFilter,  setLocFilter]  = useState('All Locations');
  const [toast,      setToast]      = useState('');
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    salary: '',
    location: '',
    type: 'Full-time',
    exp: '0-2 yrs',
    skills: '',
    description: '',
  });
  const [adding, setAdding] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddJob = async () => {
    if (!jobForm.title.trim() || !jobForm.company.trim()) {
      showToast('Title and company are required!');
      return;
    }

    setAdding(true);
    const result = await addJob({
      title: jobForm.title,
      company: jobForm.company,
      salary: jobForm.salary || 'Competitive',
      location: jobForm.location || 'Remote',
      type: jobForm.type,
      exp: jobForm.exp,
      skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: jobForm.description,
      status: 'open',
    });
    setAdding(false);

    if (result.ok) {
      showToast(`Job "${jobForm.title}" added successfully! 🎉`);
      setShowAddJob(false);
      setJobForm({ title: '', company: '', salary: '', location: '', type: 'Full-time', exp: '0-2 yrs', skills: '', description: '' });
    } else {
      showToast(`Failed to add job: ${result.error}`);
    }
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
        {/* Header with Add Job button */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Job Openings
            </h1>
            <p style={{ fontSize: 15, color: t.textMuted }}>Discover opportunities tailored for you</p>
          </div>
          {user && String(user.role || '').toLowerCase() === 'company' && (
            <button
              onClick={() => setShowAddJob(true)}
              className="btn btn-primary"
              style={{
                background: '#2ea87e',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = '#249065'}
              onMouseLeave={e => e.target.style.background = '#2ea87e'}
            >
              ➕ Add Job
            </button>
          )}
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

      {/* Add Job Modal */}
      {showAddJob && (
        <div 
          className="modal-overlay" 
          onClick={e => e.target === e.currentTarget && setShowAddJob(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div 
            className="modal-box slide-in" 
            style={{ background: t.surface, maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', borderRadius: 16, padding: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text }}>Post a New Job</h2>
              <button 
                onClick={() => setShowAddJob(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: t.textMuted }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Job Title*', name: 'title', placeholder: 'e.g., Senior Developer' },
                { label: 'Company*', name: 'company', placeholder: 'e.g., Google' },
                { label: 'Salary', name: 'salary', placeholder: 'e.g., 10-15 LPA' },
                { label: 'Location', name: 'location', placeholder: 'e.g., Bangalore' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={jobForm[field.name]}
                    onChange={handleJobFormChange}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: `1px solid ${t.border}`, background: t.bgAlt,
                      color: t.text, fontFamily: 'inherit', fontSize: 14,
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={jobForm.type}
                    onChange={handleJobFormChange}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: `1px solid ${t.border}`, background: t.bgAlt,
                      color: t.text, fontFamily: 'inherit', fontSize: 14,
                    }}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                    Experience
                  </label>
                  <input
                    type="text"
                    name="exp"
                    value={jobForm.exp}
                    onChange={handleJobFormChange}
                    placeholder="e.g., 2-4 yrs"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: `1px solid ${t.border}`, background: t.bgAlt,
                      color: t.text, fontFamily: 'inherit', fontSize: 14,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={jobForm.skills}
                  onChange={handleJobFormChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1px solid ${t.border}`, background: t.bgAlt,
                    color: t.text, fontFamily: 'inherit', fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  placeholder="Job description, requirements, etc..."
                  rows="4"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1px solid ${t.border}`, background: t.bgAlt,
                    color: t.text, fontFamily: 'inherit', fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  onClick={handleAddJob}
                  disabled={adding}
                  className="btn btn-primary"
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                    background: '#2ea87e', color: '#fff', fontWeight: 600, fontSize: 14,
                    cursor: adding ? 'not-allowed' : 'pointer', opacity: adding ? 0.6 : 1,
                  }}
                >
                  {adding ? 'Adding...' : 'Post Job'}
                </button>
                <button
                  onClick={() => setShowAddJob(false)}
                  className="btn"
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8, border: `1px solid ${t.border}`,
                    background: 'transparent', color: t.text, fontWeight: 600, fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer dark={dark} t={t} />
    </div>
  );
}
