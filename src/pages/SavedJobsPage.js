import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import JobCard from '../components/jobs/JobCard';

export default function SavedJobsPage({ t, dark, onNeedLogin }) {
  const { user } = useAuth();
  const { allJobs, loading } = useJobs();

  const savedIds = (user && (user.savedJobs || []).map(s => (typeof s === 'object' ? s.jobId : s))) || [];

  const savedJobs = allJobs.filter(j => savedIds.some(id => String(id) === String(j.id)));

  if (loading) return <div style={{ padding: 24 }}>Loading saved jobs…</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 20px' }}>
      <h2 style={{ marginBottom: 12, color: t.text }}>Saved Jobs</h2>
      {(!user || savedJobs.length === 0) ? (
        <div style={{ padding: 24, background: t.surface, borderRadius: 10, border: `1px solid ${t.border}` }}>
          {user ? 'No saved jobs yet. Browse jobs and save ones you like.' : 'Please log in to see your saved jobs.'}
        </div>
      ) : (
        savedJobs.map(job => (
          <JobCard key={job.id} job={job} dark={dark} t={t} onNeedLogin={onNeedLogin} />
        ))
      )}
    </div>
  );
}
