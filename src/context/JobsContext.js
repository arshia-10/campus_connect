import React, { createContext, useContext, useState, useEffect } from 'react';
import { JOBS } from '../data/jobs';

const JobsContext = createContext(null);
const ADMIN_JOBS_KEY = 'cc_admin_jobs';

export function JobsProvider({ children }) {
  const [adminJobs, setAdminJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ADMIN_JOBS_KEY) || '[]'); }
    catch { return []; }
  });

  const allJobs = [...JOBS, ...adminJobs];

  const addJob = (job) => {
    const updated = [...adminJobs, job];
    setAdminJobs(updated);
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(updated));
  };

  const removeJob = (jobId) => {
    const updated = adminJobs.filter(j => j.id !== jobId);
    setAdminJobs(updated);
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(updated));
  };

  const updateJobStatus = (jobId, status) => {
    const updated = adminJobs.map(j => j.id === jobId ? { ...j, status } : j);
    setAdminJobs(updated);
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(updated));
  };

  return (
    <JobsContext.Provider value={{ allJobs, adminJobs, addJob, removeJob, updateJobStatus }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobsContext);
}
