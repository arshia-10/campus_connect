import React, { createContext, useContext, useState, useEffect } from 'react';
import { JOBS } from '../data/jobs';

const JobsContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export function JobsProvider({ children }) {
  const [dbJobs, setDbJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from backend on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/jobs`);
        const data = await res.json();
        if (data.ok && data.jobs) {
          // Transform DB jobs to match frontend job shape
          const transformed = data.jobs.map(job => ({
            id: job._id,
            title: job.title || job.role,
            company: job.company || 'Unknown Company',
            salary: job.salary || job.package || 'Competitive',
            salaryMin: job.salaryMin || 0,
            location: job.location || 'Remote',
            type: job.type || 'Full-time',
            posted: job.posted || '2 days ago',
            applicants: job.applicants || 0,
            exp: job.exp || '0-2 yrs',
            skills: job.skills || [],
            status: job.status || 'open',
            description: job.description || '',
            color: job.color || '#3b6fd4',
            initial: job.initial || (job.company ? job.company.charAt(0) : 'J'),
            postedBy: job.postedBy,
          }));
          setDbJobs(transformed);
        }
      } catch (e) {
        console.error('Failed to fetch jobs:', e);
        setDbJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const allJobs = dbJobs;

  const addJob = async (jobData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      const data = await res.json();
      if (data.ok && data.job) {
        const newJob = {
          id: data.job._id,
          title: data.job.title || data.job.role,
          company: data.job.company || 'Unknown Company',
          salary: data.job.salary || data.job.package || 'Competitive',
          location: data.job.location || 'Remote',
          type: data.job.type || 'Full-time',
          posted: 'just now',
          applicants: 0,
          exp: data.job.exp || '0-2 yrs',
          skills: data.job.skills || [],
          status: data.job.status || 'open',
          description: data.job.description || '',
          color: data.job.color || '#3b6fd4',
          initial: data.job.company ? data.job.company.charAt(0) : 'J',
        };
        setDbJobs([newJob, ...dbJobs]);
        return { ok: true, job: newJob };
      }
      return { ok: false, error: data.error || 'Failed to add job' };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  const removeJob = async (jobId) => {
    setDbJobs(dbJobs.filter(j => j.id !== jobId));
  };

  const updateJobStatus = (jobId, status) => {
    setDbJobs(dbJobs.map(j => j.id === jobId ? { ...j, status } : j));
  };

  return (
    <JobsContext.Provider value={{ allJobs, loading, addJob, removeJob, updateJobStatus }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobsContext);
}
