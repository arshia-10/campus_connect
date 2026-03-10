import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ initialMode = 'login', onClose, dark, t }) {
  const { login, signup } = useAuth();
  const [mode,     setMode]     = useState(initialMode);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('Student');
  const [branch,   setBranch]   = useState('');
  const [cgpa,     setCgpa]     = useState('');
  const [rollNo,   setRollNo]   = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const submit = async () => {
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (mode === 'login') {
      const res = login(email, password);
      if (res.ok) { onClose(); }
      else { setError(res.error); }
    } else {
      if (!name.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
      const res = signup(name, email, password, role, { branch, cgpa, rollNo });
      if (res.ok) { onClose(); }
      else { setError(res.error); }
    }
    setLoading(false);
  };

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box${dark ? ' modal-box-dark' : ''}`} style={{ background: t.surface }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: t.bgAlt, border: 'none', borderRadius: 8,
          width: 32, height: 32, cursor: 'pointer', fontSize: 16,
          color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a3a5c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: t.text }}>CampusConnect</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>Placement &amp; Career Portal</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: t.bgAlt, borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
              background: mode === m ? t.surface : 'transparent',
              color: mode === m ? t.text : t.textMuted,
              boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}>{m === 'login' ? 'Log in' : 'Sign up'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name — signup only */}
          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input className={`input${dark ? ' input-dark' : ''}`} placeholder="Arjun Sharma"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <input className={`input${dark ? ' input-dark' : ''}`} type="email" placeholder="you@college.edu"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input className={`input${dark ? ' input-dark' : ''}`}
                type={showPwd ? 'text' : 'password'}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter your password'}
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ paddingRight: 42 }} />
              <button onClick={() => setShowPwd(s => !s)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: t.textMuted,
              }}>{showPwd ? '🙈' : '👁'}</button>
            </div>
          </div>

          {/* Role + extra fields — signup only */}
          {mode === 'signup' && (
            <>
              <div>
                <label style={labelStyle}>I am a...</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Student', 'Recruiter', 'TPO/Admin'].map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{
                      flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                      border: `1.5px solid ${role === r ? '#2ea87e' : t.border}`,
                      background: role === r ? 'rgba(46,168,126,0.1)' : 'transparent',
                      color: role === r ? '#2ea87e' : t.textMuted,
                      transition: 'all 0.18s',
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              {role === 'Student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Branch</label>
                    <input className={`input${dark ? ' input-dark' : ''}`} placeholder="Computer Science"
                      value={branch} onChange={e => setBranch(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>CGPA</label>
                    <input className={`input${dark ? ' input-dark' : ''}`} placeholder="8.5"
                      value={cgpa} onChange={e => setCgpa(e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Roll Number</label>
                    <input className={`input${dark ? ' input-dark' : ''}`} placeholder="CS21B047"
                      value={rollNo} onChange={e => setRollNo(e.target.value)} />
                  </div>
                </div>
              )}
            </>
          )}

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <button className="btn btn-primary btn-lg" onClick={submit} disabled={loading} style={{ borderRadius: 10, marginTop: 4 }}>
            {loading ? <span className="spinner" /> : (mode === 'login' ? 'Log in to Portal' : 'Create Account')}
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', fontSize: 12, color: t.textMuted, lineHeight: 1.8 }}>
              Demo credentials:<br />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2ea87e' }}>student@campus.edu</span>
              {' / '}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2ea87e' }}>password123</span>
              <br />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#f59e0b' }}>admin@campus.edu</span>
              {' / '}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#f59e0b' }}>admin123</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
