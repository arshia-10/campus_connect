import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'cc_users';
const SESSION_KEY = 'cc_session';

const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'Arjun Sharma',
    email: 'student@campus.edu',
    password: 'password123',
    role: 'Student',
    branch: 'Computer Science',
    cgpa: '8.7',
    rollNo: 'CS21B047',
    phone: '9876543210',
    avatar: null,
    appliedJobs: [],
    savedJobs: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Admin TPO',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'TPO/Admin',
    branch: '',
    cgpa: '',
    rollNo: '',
    phone: '9999999999',
    avatar: null,
    appliedJobs: [],
    savedJobs: [],
    createdAt: new Date().toISOString(),
  },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  } catch { return DEFAULT_USERS; }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [users, setUsers]   = useState(loadUsers);
  const [user,  setUser]    = useState(loadSession);

  // Sync current user data when users array changes
  useEffect(() => {
    if (user) {
      const fresh = users.find(u => u.id === user.id);
      if (fresh) setUser(fresh);
    }
  }, [users]); // eslint-disable-line

  const persistUsers = (updated) => {
    setUsers(updated);
    saveUsers(updated);
  };

  // ── AUTH ──────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    return { ok: true, user: found };
  };

  const signup = (name, email, password, role, extra = {}) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: 'This email is already registered.' };
    if (password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters.' };

    const newUser = {
      id: `u${Date.now()}`,
      name, email, password, role,
      branch: extra.branch || '',
      cgpa:   extra.cgpa   || '',
      rollNo: extra.rollNo || '',
      phone:  extra.phone  || '',
      avatar: null,
      appliedJobs: [],
      savedJobs: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    persistUsers(updated);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { ok: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (fields) => {
    const updated = users.map(u =>
      u.id === user.id ? { ...u, ...fields } : u
    );
    persistUsers(updated);
  };

  // ── JOBS ──────────────────────────────────────────────────────────────────
  const applyToJob = (jobId) => {
    if (!user) return false;
    if (user.appliedJobs.includes(jobId)) return false;
    const updated = users.map(u =>
      u.id === user.id
        ? { ...u, appliedJobs: [...u.appliedJobs, { jobId, appliedAt: new Date().toISOString(), status: 'Applied' }] }
        : u
    );
    persistUsers(updated);
    return true;
  };

  const toggleSaveJob = (jobId) => {
    if (!user) return;
    const isSaved = user.savedJobs.includes(jobId);
    const updated = users.map(u =>
      u.id === user.id
        ? { ...u, savedJobs: isSaved ? u.savedJobs.filter(id => id !== jobId) : [...u.savedJobs, jobId] }
        : u
    );
    persistUsers(updated);
  };

  const hasApplied = (jobId) => {
    if (!user) return false;
    return user.appliedJobs.some(a => (typeof a === 'object' ? a.jobId : a) === jobId);
  };

  const isSaved = (jobId) => {
    if (!user) return false;
    return user.savedJobs.includes(jobId);
  };

  // ── ADMIN JOBS ────────────────────────────────────────────────────────────
  const ADMIN_JOBS_KEY = 'cc_admin_jobs';

  const getAdminJobs = () => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_JOBS_KEY) || '[]');
    } catch { return []; }
  };

  const postJob = (jobData) => {
    const existing = getAdminJobs();
    const newJob = {
      ...jobData,
      id: Date.now(),
      applicants: 0,
      posted: 'Just now',
      postedBy: user?.id,
      postedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify([...existing, newJob]));
    return newJob;
  };

  const deleteJob = (jobId) => {
    const existing = getAdminJobs();
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(existing.filter(j => j.id !== jobId)));
  };

  // All applicants for admin
  const getAllApplicants = () => {
    return users
      .filter(u => u.role === 'Student' && u.appliedJobs.length > 0)
      .flatMap(u =>
        u.appliedJobs.map(a => ({
          ...u,
          jobId: typeof a === 'object' ? a.jobId : a,
          appliedAt: typeof a === 'object' ? a.appliedAt : '',
          appStatus: typeof a === 'object' ? a.status : 'Applied',
        }))
      );
  };

  const updateApplicantStatus = (userId, jobId, status) => {
    const updated = users.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        appliedJobs: u.appliedJobs.map(a =>
          (typeof a === 'object' ? a.jobId : a) === jobId
            ? { ...(typeof a === 'object' ? a : { jobId: a }), status }
            : a
        ),
      };
    });
    persistUsers(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, users,
      login, signup, logout, updateProfile,
      applyToJob, toggleSaveJob, hasApplied, isSaved,
      postJob, deleteJob, getAdminJobs,
      getAllApplicants, updateApplicantStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
