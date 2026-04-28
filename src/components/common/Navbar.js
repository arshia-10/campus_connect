import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ page, setPage, dark, toggleDark, onLogin, onSignup }) {
  const { user, logout } = useAuth();

  const t = dark
    ? { bg: '#111827', border: '#1f2d45', text: '#e2e8f0', muted: '#9ca3af' }
    : { bg: '#ffffff', border: '#e8edf5', text: '#1a2236', muted: '#64748b' };

  const navLinks = [
    { id: 'home',      label: 'Home'      },
    { id: 'jobs',      label: 'Jobs'      },
    { id: 'saved',     label: 'Saved'     },
    { id: 'companies', label: 'Companies' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: t.bg, borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 60, gap: 4,
      }}>
        {/* Logo */}
        <div
          onClick={() => setPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginRight: 16 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#1a3a5c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: t.text, letterSpacing: '-0.02em' }}>
            CampusConnect
          </span>
        </div>

        {/* Nav Links */}
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => setPage(link.id)}
            className={`nav-link${dark ? ' nav-link-dark' : ''}${page === link.id ? ' active' : ''}`}
          >
            {link.label}
          </button>
        ))}

        {/* Dashboard link — only when logged in */}
        {user && (
          <button
            onClick={() => setPage(user.role === 'TPO/Admin' ? 'admin' : 'dashboard')}
            className={`nav-link${dark ? ' nav-link-dark' : ''}${(page === 'dashboard' || page === 'admin') ? ' active' : ''}`}
          >
            {user.role === 'TPO/Admin' ? 'Admin Panel' : 'Dashboard'}
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          style={{
            background: dark ? '#1e2535' : '#f1f5f9', border: 'none', borderRadius: 8,
            width: 36, height: 36, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Auth area */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2ea87e, #1a3a5c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
              onClick={() => setPage('dashboard')}
            >
              {user.name.charAt(0)}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>
              {user.name.split(' ')[0]}
            </span>
            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              style={{ color: dark ? '#9ca3af' : '#1a3a5c', borderColor: dark ? '#2a3550' : '#1a3a5c' }}
            >
              Log out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
            <button onClick={onLogin}  className="btn btn-outline btn-sm">Log in</button>
            <button onClick={onSignup} className="btn btn-primary btn-sm">Sign up</button>
          </div>
        )}
      </div>
    </nav>
  );
}
