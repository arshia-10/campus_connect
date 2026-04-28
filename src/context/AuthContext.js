import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'cc_users';
const SESSION_KEY = 'cc_session';
const TOKEN_KEY = 'cc_token';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
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

function normalizeUser(user, password = '') {
  return {
    id: user.id || `u${Date.now()}`,
    name: user.name || '',
    email: user.email || '',
    password: password || '',
    role: user.role || 'Student',
    branch: user.branch || '',
    cgpa: user.cgpa || '',
    rollNo: user.rollNo || '',
    phone: user.phone || '',
    avatar: user.avatar || null,
    resume: user.resume || null,
    appliedJobs: user.appliedJobs || [],
    savedJobs: user.savedJobs || [],
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

async function requestAuth(path, payload, method = 'POST', token = '') {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    return { ok: false, error: data.error || 'Request failed.' };
  }
  return data;
}

export function AuthProvider({ children }) {
  const [users, setUsers]   = useState(loadUsers);
  const [user,  setUser]    = useState(loadSession);

  // on mount, if token exists verify and restore user (with appliedJobs) from backend
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;
      try {
        const resp = await fetch(`${API_BASE_URL}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await resp.json();
        if (!resp.ok || !data.ok || !data.user) return;
        const fromApi = normalizeUser(data.user, '');
        const exists = users.find(u => u.email.toLowerCase() === fromApi.email.toLowerCase());
        const merged = { ...(exists || {}), ...fromApi };
        const updated = exists ? users.map(u => (u.email.toLowerCase() === fromApi.email.toLowerCase() ? merged : u)) : [...users, merged];
        persistUsers(updated);
        setUser(merged);
        localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
      } catch (e) {
        // ignore
      }
    };
    restore();
  }, []);

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
  const login = async (email, password) => {
    try {
      const res = await requestAuth('/auth/login', { email, password });
      if (res.ok && res.user) {
        const fromApi = normalizeUser(res.user, password);
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        const merged = {
          ...(existing || {}),
          ...fromApi,
          password,
        };

        const updated = existing
          ? users.map(u => (u.email.toLowerCase() === email.toLowerCase() ? merged : u))
          : [...users, merged];

        persistUsers(updated);
        setUser(merged);
        localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
        if (res.token) {
          localStorage.setItem(TOKEN_KEY, res.token);
        }
        return { ok: true, user: merged };
      }

      if (res.error) {
        return { ok: false, error: res.error };
      }
    } catch {
      return { ok: false, error: 'Server unavailable. Please try again.' };
    }

    return { ok: false, error: 'Invalid email or password.' };
  };

  const signup = async (name, email, password, role, extra = {}) => {
    if (password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters.' };

    const res = await requestAuth('/auth/register', {
      name,
      email,
      password,
      role,
      branch: extra.branch,
      cgpa: extra.cgpa,
      rollNo: extra.rollNo,
      phone: extra.phone,
    });

    if (!res.ok) {
      return { ok: false, error: res.error || 'Unable to register.' };
    }

    const newUser = normalizeUser(
      {
        ...(res.user || {}),
        name,
        email,
        role,
        branch: extra.branch || res.user?.branch,
        cgpa: extra.cgpa || res.user?.cgpa,
        rollNo: extra.rollNo || res.user?.rollNo,
      },
      password
    );

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const updated = exists
      ? users.map(u => (u.email.toLowerCase() === email.toLowerCase() ? newUser : u))
      : [...users, newUser];

    persistUsers(updated);
    return { ok: true, user: newUser, message: 'Registration successful. Please log in.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (fields) => {
    if (!user) return { ok: false, error: 'Not logged in.' };

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { ok: false, error: 'Missing auth token.' };

    try {
      const res = await requestAuth('/auth/profile', fields, 'PUT', token);
      if (!res.ok || !res.user) {
        return { ok: false, error: res.error || 'Unable to update profile.' };
      }

      const fromApi = normalizeUser(res.user, user.password || '');
      const updated = users.map(u => (u.id === user.id ? { ...u, ...fromApi } : u));
      persistUsers(updated);
      setUser(fromApi);
      localStorage.setItem(SESSION_KEY, JSON.stringify(fromApi));
      return { ok: true, user: fromApi };
    } catch (e) {
      return { ok: false, error: 'Unable to update profile.' };
    }
  };

  // ── JOBS ──────────────────────────────────────────────────────────────────
  const applyToJob = async (jobId) => {
    if (!user) return false;

    // already applied?
    if ((user.appliedJobs || []).some(a => String(typeof a === 'object' ? a.jobId : a) === String(jobId))) return false;

    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const resp = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ job_id: jobId }),
      });
      const data = await resp.json();
      if (!resp.ok) return false;

      const newEntry = { jobId: String(jobId), appliedAt: (data.application && data.application.applied_date) || new Date().toISOString(), status: (data.application && data.application.status) || 'Applied' };
      const updated = users.map(u => u.id === user.id ? { ...u, appliedJobs: [...(u.appliedJobs || []), newEntry] } : u);
      persistUsers(updated);
      const newUser = updated.find(u => u.id === user.id);
      setUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return true;
    } catch (e) {
      return false;
    }
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) return false;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      const resp = await fetch(`${API_BASE_URL}/saved-jobs/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) return false;

      const savedJobs = data.saved
        ? [...(user.savedJobs || []), String(jobId)]
        : (user.savedJobs || []).filter(id => String(id) !== String(jobId));

      const updated = users.map(u =>
        u.id === user.id
          ? { ...u, savedJobs }
          : u
      );

      persistUsers(updated);
      const newUser = updated.find(u => u.id === user.id);
      setUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return true;
    } catch (e) {
      return false;
    }
  };

  const hasApplied = (jobId) => {
    if (!user) return false;
    return user.appliedJobs.some(a => (typeof a === 'object' ? a.jobId : a) === jobId);
  };

  const isSaved = (jobId) => {
    if (!user) return false;
    return (user.savedJobs || []).some(a => (typeof a === 'object' ? a.jobId : a) === jobId);
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
